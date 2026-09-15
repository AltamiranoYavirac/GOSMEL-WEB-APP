-- Rediseño de cobranzas: responsable explícito, cargos auditables y cobros
-- consolidados con aplicaciones. Todas las escrituras financieras pasan por
-- RPC para preservar consistencia y trazabilidad.

create type public.tipo_cuota as enum ('mensualidad', 'extraordinaria');
create type public.origen_cuota as enum ('matricula', 'generacion_mensual', 'manual');
create type public.estado_cobro as enum ('pendiente_verificacion', 'aprobado', 'rechazado', 'anulado');
create type public.metodo_cobro as enum ('transferencia', 'deposito', 'efectivo', 'tarjeta', 'punto_de_venta', 'otro');

alter table public.acuerdos_pago
  add column if not exists responsable_representante_id uuid references public.representantes(id) on delete restrict;

create table public.acuerdo_condiciones (
  id uuid primary key default gen_random_uuid(),
  acuerdo_id uuid not null references public.acuerdos_pago(id) on delete cascade,
  vigente_desde date not null,
  monto_mensual numeric(10,2) not null check (monto_mensual > 0),
  dia_cobro smallint not null check (dia_cobro between 1 and 28),
  moneda char(3) not null default 'USD',
  motivo text,
  creado_por uuid references public.perfiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (acuerdo_id, vigente_desde),
  check (date_trunc('month', vigente_desde)::date = vigente_desde)
);

insert into public.acuerdo_condiciones (acuerdo_id, vigente_desde, monto_mensual, dia_cobro, moneda, motivo, creado_por)
select a.id, date_trunc('month', a.fecha_inicio)::date, a.monto_mensual,
       coalesce(a.dia_cobro, 5), a.moneda, a.motivo_ajuste, a.acordado_por
from public.acuerdos_pago a
where a.monto_mensual > 0
on conflict (acuerdo_id, vigente_desde) do nothing;

alter table public.cuotas
  alter column acuerdo_id drop not null,
  add column if not exists estudiante_id uuid references public.estudiantes(id) on delete restrict,
  add column if not exists responsable_representante_id uuid references public.representantes(id) on delete restrict,
  add column if not exists tipo public.tipo_cuota not null default 'mensualidad',
  add column if not exists concepto text,
  add column if not exists origen public.origen_cuota not null default 'generacion_mensual',
  add column if not exists creada_por uuid references public.perfiles(id) on delete set null,
  add column if not exists condonada_por uuid references public.perfiles(id) on delete set null,
  add column if not exists condonada_en timestamptz,
  add column if not exists motivo_condonacion text,
  add column if not exists anulada_por uuid references public.perfiles(id) on delete set null,
  add column if not exists anulada_en timestamptz,
  add column if not exists motivo_anulacion text;

update public.cuotas c
set estudiante_id = a.estudiante_id,
    responsable_representante_id = a.responsable_representante_id
from public.acuerdos_pago a
where c.acuerdo_id = a.id and c.estudiante_id is null;

alter table public.cuotas alter column estudiante_id set not null;
alter table public.cuotas
  add constraint cuotas_tipo_acuerdo_check check (
    (tipo = 'mensualidad' and acuerdo_id is not null)
    or tipo = 'extraordinaria'
  );

alter table public.cuotas drop constraint if exists cuotas_acuerdo_id_periodo_mes_key;
create unique index if not exists cuotas_mensualidad_unica
  on public.cuotas(acuerdo_id, periodo_mes)
  where tipo = 'mensualidad' and estado <> 'anulada';
create index if not exists cuotas_responsable_estado_idx
  on public.cuotas(responsable_representante_id, fecha_vencimiento)
  where estado in ('pendiente', 'parcial');
create index if not exists cuotas_estudiante_estado_idx
  on public.cuotas(estudiante_id, fecha_vencimiento)
  where estado in ('pendiente', 'parcial');

create sequence if not exists public.cobro_numero_seq;
create table public.cobros (
  id uuid primary key default gen_random_uuid(),
  numero bigint not null default nextval('public.cobro_numero_seq'),
  responsable_representante_id uuid references public.representantes(id) on delete restrict,
  responsable_estudiante_id uuid references public.estudiantes(id) on delete restrict,
  monto_total numeric(10,2) not null check (monto_total > 0),
  fecha_pago date not null default current_date,
  metodo public.metodo_cobro not null,
  referencia text,
  comprobante_storage_path text,
  estado public.estado_cobro not null default 'pendiente_verificacion',
  origen text not null check (origen in ('admin', 'portal')),
  observacion text,
  registrado_por uuid references public.perfiles(id) on delete set null,
  revisado_por uuid references public.perfiles(id) on delete set null,
  revisado_en timestamptz,
  motivo_rechazo text,
  anulado_por uuid references public.perfiles(id) on delete set null,
  anulado_en timestamptz,
  motivo_anulacion text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(numero),
  check ((responsable_representante_id is null) <> (responsable_estudiante_id is null))
);

create table public.cobro_aplicaciones (
  id uuid primary key default gen_random_uuid(),
  cobro_id uuid not null references public.cobros(id) on delete restrict,
  cuota_id uuid not null references public.cuotas(id) on delete restrict,
  monto numeric(10,2) not null check (monto > 0),
  created_at timestamptz not null default now(),
  unique(cobro_id, cuota_id)
);
create index cobro_aplicaciones_cuota_idx on public.cobro_aplicaciones(cuota_id);
create index cobros_estado_fecha_idx on public.cobros(estado, fecha_pago desc);

create table public.auditoria_financiera (
  id uuid primary key default gen_random_uuid(),
  entidad text not null,
  entidad_id uuid not null,
  accion text not null,
  detalle jsonb not null default '{}'::jsonb,
  actor_id uuid references public.perfiles(id) on delete set null,
  created_at timestamptz not null default now()
);
create index auditoria_financiera_entidad_idx on public.auditoria_financiera(entidad, entidad_id, created_at desc);

create or replace function public.validar_responsable_acuerdo()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.responsable_representante_id is not null and not exists (
    select 1 from public.estudiante_representante er
    where er.estudiante_id = new.estudiante_id and er.representante_id = new.responsable_representante_id
  ) then
    raise exception 'El responsable debe estar vinculado al estudiante';
  end if;
  if (select fecha_nacimiento > current_date - interval '18 years' from public.estudiantes where id = new.estudiante_id)
     and new.responsable_representante_id is null then
    raise exception 'Un estudiante menor requiere un representante responsable de pago';
  end if;
  return new;
end; $$;
drop trigger if exists trg_validar_responsable_acuerdo on public.acuerdos_pago;
create trigger trg_validar_responsable_acuerdo before insert or update of estudiante_id, responsable_representante_id
on public.acuerdos_pago for each row execute function public.validar_responsable_acuerdo();

create or replace function public.recalcular_cuota_desde_cobros(p_cuota_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare v_total numeric(10,2); v_monto numeric(10,2); v_estado public.estado_cuota;
begin
  select monto, estado into v_monto, v_estado from public.cuotas where id = p_cuota_id for update;
  if not found or v_estado in ('condonada', 'anulada') then return; end if;
  select coalesce(sum(a.monto), 0) into v_total
  from public.cobro_aplicaciones a join public.cobros c on c.id = a.cobro_id
  where a.cuota_id = p_cuota_id and c.estado = 'aprobado';
  update public.cuotas set monto_pagado = v_total,
    fecha_pago = case when v_total >= v_monto then (select max(c.fecha_pago) from public.cobro_aplicaciones a join public.cobros c on c.id=a.cobro_id where a.cuota_id=p_cuota_id and c.estado='aprobado') else null end,
    estado = case when v_total >= v_monto then 'pagada'::public.estado_cuota when v_total > 0 then 'parcial'::public.estado_cuota else 'pendiente'::public.estado_cuota end
  where id = p_cuota_id;
end; $$;

create or replace function public.recalcular_cuotas_cobro()
returns trigger language plpgsql security definer set search_path = '' as $$
declare r record; v_cobro_id uuid;
begin
  v_cobro_id := case when tg_op = 'DELETE' then old.id else new.id end;
  for r in select distinct cuota_id from public.cobro_aplicaciones where cobro_id = v_cobro_id loop
    perform public.recalcular_cuota_desde_cobros(r.cuota_id);
  end loop;
  return null;
end; $$;
create or replace function public.recalcular_cuota_aplicacion()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  perform public.recalcular_cuota_desde_cobros(case when tg_op = 'DELETE' then old.cuota_id else new.cuota_id end);
  return null;
end; $$;
drop trigger if exists trg_cobro_recalcula_cuotas on public.cobros;
create trigger trg_cobro_recalcula_cuotas after update of estado on public.cobros for each row execute function public.recalcular_cuotas_cobro();
drop trigger if exists trg_aplicacion_recalcula_cuota on public.cobro_aplicaciones;
create trigger trg_aplicacion_recalcula_cuota after insert or update or delete on public.cobro_aplicaciones for each row execute function public.recalcular_cuota_aplicacion();

create or replace function public.generar_cuotas_mes(p_mes date)
returns integer language plpgsql security definer set search_path = '' as $$
declare v_creadas int;
begin
  if not public.es_admin() then raise exception 'Solo un administrador puede generar cuotas'; end if;
  insert into public.cuotas (acuerdo_id, estudiante_id, responsable_representante_id, tipo, concepto, origen, periodo_mes, monto, fecha_vencimiento, creada_por)
  select a.id, a.estudiante_id, a.responsable_representante_id, 'mensualidad', 'Mensualidad', 'generacion_mensual',
    date_trunc('month', p_mes)::date, c.monto_mensual,
    (date_trunc('month', p_mes) + make_interval(days => c.dia_cobro - 1))::date, auth.uid()
  from public.acuerdos_pago a
  join lateral (select * from public.acuerdo_condiciones ac where ac.acuerdo_id=a.id and ac.vigente_desde<=date_trunc('month',p_mes)::date order by ac.vigente_desde desc limit 1) c on true
  where a.estado='vigente' and a.fecha_inicio <= (date_trunc('month',p_mes) + interval '1 month - 1 day')::date
    and (a.fecha_fin is null or a.fecha_fin >= date_trunc('month',p_mes)::date)
  on conflict (acuerdo_id, periodo_mes) where tipo='mensualidad' and estado<>'anulada' do nothing;
  get diagnostics v_creadas = row_count;
  return v_creadas;
end; $$;

drop view if exists public.v_cobranza_familia;
drop view if exists public.v_estado_cuenta;
create view public.v_estado_cuenta with (security_invoker=on) as
select c.id cuota_id, c.estudiante_id, trim(e.nombres || ' ' || e.apellidos) estudiante,
  c.responsable_representante_id, c.acuerdo_id, c.tipo, c.concepto, c.origen, c.periodo_mes, c.monto, c.monto_pagado,
  case when c.estado in ('condonada','anulada') then 0 else greatest(c.monto-c.monto_pagado,0) end saldo,
  c.fecha_vencimiento, c.fecha_pago, c.estado,
  case when c.estado='condonada' then 'condonada' when c.estado='anulada' then 'anulada' when c.monto_pagado>=c.monto then 'pagada'
       when c.fecha_vencimiento < current_date then 'vencida' when c.monto_pagado>0 then 'parcial' else 'pendiente' end estado_efectivo,
  greatest(coalesce(current_date-c.fecha_vencimiento,0),0) dias_mora
from public.cuotas c join public.estudiantes e on e.id=c.estudiante_id;

-- Compatibilidad temporal de la vista anterior: las pantallas nuevas consumen
-- v_cobranza_responsables, que no duplica el saldo por cada vínculo familiar.
create view public.v_cobranza_familia with (security_invoker=on) as
select r.id representante_id, trim(r.nombres || ' ' || r.apellidos) representante, r.celular,
  ec.periodo_mes, count(*) hijos_con_cuota,
  string_agg(ec.estudiante || ': ' || to_char(ec.saldo, 'FM999990.00'), ' · ' order by ec.estudiante) detalle,
  sum(ec.monto) total_mes, sum(ec.saldo) saldo_total, max(ec.dias_mora) dias_mora_max
from public.v_estado_cuenta ec
join public.estudiante_representante er on er.estudiante_id=ec.estudiante_id and er.es_contacto_principal
join public.representantes r on r.id=er.representante_id
group by r.id,r.nombres,r.apellidos,r.celular,ec.periodo_mes;

create or replace view public.v_cobranza_responsables with (security_invoker=on) as
select coalesce(c.responsable_representante_id, c.estudiante_id) responsable_id,
  case when c.responsable_representante_id is null then 'estudiante' else 'representante' end responsable_tipo,
  coalesce(trim(r.nombres||' '||r.apellidos), trim(e_resp.nombres||' '||e_resp.apellidos)) responsable,
  coalesce(r.celular,e_resp.celular) celular, count(distinct c.estudiante_id) estudiantes_con_cargo,
  sum(ec.saldo) saldo_total, sum(ec.saldo) filter (where ec.periodo_mes=date_trunc('month',current_date)::date) saldo_mes,
  max(ec.dias_mora) filter (where ec.estado_efectivo='vencida') dias_mora_max
from public.v_estado_cuenta ec join public.cuotas c on c.id=ec.cuota_id
left join public.representantes r on r.id=c.responsable_representante_id
left join public.estudiantes e_resp on e_resp.id=c.estudiante_id and c.responsable_representante_id is null
where ec.saldo>0
group by coalesce(c.responsable_representante_id,c.estudiante_id), case when c.responsable_representante_id is null then 'estudiante' else 'representante' end, r.nombres,r.apellidos,r.celular,e_resp.nombres,e_resp.apellidos,e_resp.celular;

alter table public.cobros enable row level security;
alter table public.cobro_aplicaciones enable row level security;
alter table public.auditoria_financiera enable row level security;
create policy "admin gestiona cobros" on public.cobros for all to authenticated using (public.es_admin()) with check (public.es_admin());
create policy "admin gestiona aplicaciones" on public.cobro_aplicaciones for all to authenticated using (public.es_admin()) with check (public.es_admin());
create policy "admin lee auditoria financiera" on public.auditoria_financiera for select to authenticated using (public.es_admin());
create policy "responsable lee sus cobros" on public.cobros for select to authenticated using (
  public.es_admin() or responsable_estudiante_id in (select public.estudiantes_accesibles()) or exists (
    select 1 from public.estudiante_representante er join public.representantes r on r.id=er.representante_id
    where er.representante_id=cobros.responsable_representante_id and r.perfil_id=auth.uid()
  )
);
create policy "responsable lee sus aplicaciones" on public.cobro_aplicaciones for select to authenticated using (
  exists (select 1 from public.cobros c where c.id=cobro_aplicaciones.cobro_id)
);
create policy "lectura de cuotas propias rediseñada" on public.cuotas for select to authenticated using (
  estudiante_id in (select public.estudiantes_accesibles())
);

create or replace function public.validar_responsable_cuota()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.responsable_representante_id is not null and not exists (
    select 1 from public.estudiante_representante er
    where er.estudiante_id = new.estudiante_id and er.representante_id = new.responsable_representante_id
  ) then
    raise exception 'El representante responsable no está vinculado al estudiante';
  end if;
  if new.responsable_representante_id is null
     and (select fecha_nacimiento > current_date - interval '18 years' from public.estudiantes where id = new.estudiante_id) then
    raise exception 'Un estudiante menor requiere representante responsable de pago';
  end if;
  return new;
end; $$;
drop trigger if exists trg_validar_responsable_cuota on public.cuotas;
create trigger trg_validar_responsable_cuota before insert or update of estudiante_id, responsable_representante_id
on public.cuotas for each row execute function public.validar_responsable_cuota();

create or replace function public.crear_cargo_extraordinario(
  p_estudiante_id uuid,
  p_responsable_representante_id uuid,
  p_monto numeric,
  p_fecha_vencimiento date,
  p_concepto text,
  p_observacion text default null
) returns public.cuotas language plpgsql security definer set search_path = '' as $$
declare v_cuota public.cuotas;
begin
  if not public.es_admin() then raise exception 'Solo un administrador puede crear cargos'; end if;
  if coalesce(trim(p_concepto), '') = '' then raise exception 'El concepto es obligatorio'; end if;
  if p_monto <= 0 then raise exception 'El monto debe ser mayor que cero'; end if;
  insert into public.cuotas (estudiante_id, responsable_representante_id, tipo, concepto, origen, periodo_mes, monto, fecha_vencimiento, observacion, creada_por)
  values (p_estudiante_id, p_responsable_representante_id, 'extraordinaria', trim(p_concepto), 'manual', date_trunc('month', p_fecha_vencimiento)::date, p_monto, p_fecha_vencimiento, p_observacion, auth.uid())
  returning * into v_cuota;
  insert into public.auditoria_financiera(entidad, entidad_id, accion, detalle, actor_id)
  values ('cuota', v_cuota.id, 'cargo_extraordinario_creado', jsonb_build_object('monto',p_monto,'concepto',p_concepto), auth.uid());
  return v_cuota;
end; $$;

create or replace function public.condonar_cuota(p_cuota_id uuid, p_motivo text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not public.es_admin() then raise exception 'Solo un administrador puede condonar cargos'; end if;
  if coalesce(trim(p_motivo), '') = '' then raise exception 'El motivo de condonación es obligatorio'; end if;
  update public.cuotas set estado='condonada', condonada_por=auth.uid(), condonada_en=now(), motivo_condonacion=trim(p_motivo)
  where id=p_cuota_id and estado not in ('pagada','anulada');
  if not found then raise exception 'La cuota no existe o no puede condonarse'; end if;
  insert into public.auditoria_financiera(entidad, entidad_id, accion, detalle, actor_id)
  values ('cuota',p_cuota_id,'condonada',jsonb_build_object('motivo',p_motivo),auth.uid());
end; $$;

create or replace function public.anular_cuota(p_cuota_id uuid, p_motivo text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not public.es_admin() then raise exception 'Solo un administrador puede anular cargos'; end if;
  if coalesce(trim(p_motivo), '') = '' then raise exception 'El motivo de anulación es obligatorio'; end if;
  if exists (select 1 from public.cobro_aplicaciones a join public.cobros c on c.id=a.cobro_id where a.cuota_id=p_cuota_id and c.estado='aprobado') then
    raise exception 'No se puede anular una cuota con cobros aprobados; anule primero el cobro';
  end if;
  update public.cuotas set estado='anulada', anulada_por=auth.uid(), anulada_en=now(), motivo_anulacion=trim(p_motivo)
  where id=p_cuota_id and estado not in ('pagada','condonada','anulada');
  if not found then raise exception 'La cuota no existe o no puede anularse'; end if;
  insert into public.auditoria_financiera(entidad, entidad_id, accion, detalle, actor_id)
  values ('cuota',p_cuota_id,'anulada',jsonb_build_object('motivo',p_motivo),auth.uid());
end; $$;

create or replace function public.registrar_cobro(
  p_responsable_representante_id uuid,
  p_responsable_estudiante_id uuid,
  p_fecha_pago date,
  p_metodo public.metodo_cobro,
  p_referencia text,
  p_comprobante_storage_path text,
  p_observacion text,
  p_origen text,
  p_aplicaciones jsonb
) returns uuid language plpgsql security definer set search_path = '' as $$
declare v_cobro_id uuid; v_total numeric(10,2); v_aplicacion record; v_cuota record;
begin
  if p_origen = 'admin' and not public.es_admin() then raise exception 'Solo un administrador puede registrar este cobro'; end if;
  if p_origen not in ('admin','portal') then raise exception 'Origen inválido'; end if;
  if (p_responsable_representante_id is null) = (p_responsable_estudiante_id is null) then raise exception 'Debe indicar un único responsable de pago'; end if;
  if p_origen='portal' and coalesce(trim(p_comprobante_storage_path),'')='' then raise exception 'El comprobante es obligatorio'; end if;
  select coalesce(sum(x.monto),0) into v_total from jsonb_to_recordset(p_aplicaciones) as x(cuota_id uuid,monto numeric);
  if v_total <= 0 then raise exception 'Debe aplicar un monto positivo a una o más cuotas'; end if;
  for v_aplicacion in select * from jsonb_to_recordset(p_aplicaciones) as x(cuota_id uuid,monto numeric) loop
    if v_aplicacion.monto <= 0 then raise exception 'Cada aplicación debe ser positiva'; end if;
    select c.id,c.monto,c.monto_pagado,c.estado,c.responsable_representante_id,c.estudiante_id into v_cuota from public.cuotas c where c.id=v_aplicacion.cuota_id for update;
    if not found or v_cuota.estado not in ('pendiente','parcial') then raise exception 'Una cuota no está disponible para cobro'; end if;
    if v_cuota.responsable_representante_id is distinct from p_responsable_representante_id or (v_cuota.responsable_representante_id is null and v_cuota.estudiante_id is distinct from p_responsable_estudiante_id) then
      raise exception 'Todas las cuotas deben pertenecer al responsable seleccionado';
    end if;
    if v_aplicacion.monto > v_cuota.monto-v_cuota.monto_pagado then raise exception 'No se permiten sobrepagos'; end if;
  end loop;
  insert into public.cobros(responsable_representante_id,responsable_estudiante_id,monto_total,fecha_pago,metodo,referencia,comprobante_storage_path,estado,origen,observacion,registrado_por)
  values(p_responsable_representante_id,p_responsable_estudiante_id,v_total,coalesce(p_fecha_pago,current_date),p_metodo,p_referencia,p_comprobante_storage_path,
    case when p_origen='portal' then 'pendiente_verificacion'::public.estado_cobro else 'aprobado'::public.estado_cobro end,p_origen,p_observacion,auth.uid()) returning id into v_cobro_id;
  insert into public.cobro_aplicaciones(cobro_id,cuota_id,monto)
  select v_cobro_id,x.cuota_id,x.monto from jsonb_to_recordset(p_aplicaciones) as x(cuota_id uuid,monto numeric);
  insert into public.auditoria_financiera(entidad, entidad_id, accion, detalle, actor_id)
  values ('cobro',v_cobro_id,'registrado',jsonb_build_object('origen',p_origen,'monto',v_total),auth.uid());
  return v_cobro_id;
end; $$;

create or replace function public.reportar_cobro_portal(
  p_cuota_id uuid, p_monto numeric, p_fecha_pago date, p_metodo public.metodo_cobro,
  p_referencia text, p_comprobante_storage_path text, p_observacion text default null
) returns uuid language plpgsql security definer set search_path = '' as $$
declare v_cuota record;
begin
  select c.id,c.estudiante_id,c.responsable_representante_id,c.monto,c.monto_pagado,c.estado into v_cuota from public.cuotas c where c.id=p_cuota_id;
  if not found or v_cuota.estado not in ('pendiente','parcial') then raise exception 'La cuota no está disponible'; end if;
  if not exists (select 1 from public.estudiantes_accesibles() e where e = v_cuota.estudiante_id) then raise exception 'No puede reportar pagos para esta cuota'; end if;
  if p_monto <= 0 or p_monto > v_cuota.monto-v_cuota.monto_pagado then raise exception 'El monto no puede superar el saldo'; end if;
  return public.registrar_cobro(v_cuota.responsable_representante_id, case when v_cuota.responsable_representante_id is null then v_cuota.estudiante_id else null end,
    p_fecha_pago,p_metodo,p_referencia,p_comprobante_storage_path,p_observacion,'portal',jsonb_build_array(jsonb_build_object('cuota_id',p_cuota_id,'monto',p_monto)));
end; $$;

create or replace function public.revisar_cobro(p_cobro_id uuid, p_aprobar boolean, p_motivo text default null)
returns void language plpgsql security definer set search_path = '' as $$
declare v_cobro public.cobros; v_a record; v_cuota record;
begin
  if not public.es_admin() then raise exception 'Solo un administrador puede revisar cobros'; end if;
  select * into v_cobro from public.cobros where id=p_cobro_id for update;
  if not found or v_cobro.estado <> 'pendiente_verificacion' then raise exception 'El cobro no está pendiente de verificación'; end if;
  if p_aprobar then
    for v_a in select * from public.cobro_aplicaciones where cobro_id=p_cobro_id loop
      select monto,monto_pagado,estado into v_cuota from public.cuotas where id=v_a.cuota_id for update;
      if v_cuota.estado not in ('pendiente','parcial') or v_a.monto > v_cuota.monto-v_cuota.monto_pagado then raise exception 'El cobro ya no puede aprobarse porque una cuota cambió'; end if;
    end loop;
    update public.cobros set estado='aprobado',revisado_por=auth.uid(),revisado_en=now(),updated_at=now() where id=p_cobro_id;
    insert into public.auditoria_financiera(entidad, entidad_id, accion, detalle, actor_id) values ('cobro',p_cobro_id,'aprobado','{}',auth.uid());
  else
    if coalesce(trim(p_motivo),'')='' then raise exception 'El motivo de rechazo es obligatorio'; end if;
    update public.cobros set estado='rechazado',revisado_por=auth.uid(),revisado_en=now(),motivo_rechazo=trim(p_motivo),updated_at=now() where id=p_cobro_id;
    insert into public.auditoria_financiera(entidad, entidad_id, accion, detalle, actor_id) values ('cobro',p_cobro_id,'rechazado',jsonb_build_object('motivo',p_motivo),auth.uid());
  end if;
end; $$;

create or replace function public.anular_cobro(p_cobro_id uuid, p_motivo text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not public.es_admin() then raise exception 'Solo un administrador puede anular cobros'; end if;
  if coalesce(trim(p_motivo),'')='' then raise exception 'El motivo de anulación es obligatorio'; end if;
  update public.cobros set estado='anulado',anulado_por=auth.uid(),anulado_en=now(),motivo_anulacion=trim(p_motivo),updated_at=now() where id=p_cobro_id and estado in ('aprobado','pendiente_verificacion');
  if not found then raise exception 'El cobro no existe o no puede anularse'; end if;
  insert into public.auditoria_financiera(entidad, entidad_id, accion, detalle, actor_id) values ('cobro',p_cobro_id,'anulado',jsonb_build_object('motivo',p_motivo),auth.uid());
end; $$;

create or replace function public.actualizar_condiciones_acuerdo(
  p_acuerdo_id uuid, p_vigente_desde date, p_monto_mensual numeric, p_dia_cobro smallint, p_motivo text default null
) returns void language plpgsql security definer set search_path = '' as $$
begin
  if not public.es_admin() then raise exception 'Solo un administrador puede actualizar acuerdos'; end if;
  if p_vigente_desde <> date_trunc('month',p_vigente_desde)::date then raise exception 'La vigencia debe iniciar el primer día del mes'; end if;
  if p_vigente_desde < date_trunc('month',current_date)::date then raise exception 'No se pueden reescribir condiciones históricas'; end if;
  if p_monto_mensual <= 0 or p_dia_cobro not between 1 and 28 then raise exception 'Condiciones inválidas'; end if;
  insert into public.acuerdo_condiciones(acuerdo_id,vigente_desde,monto_mensual,dia_cobro,moneda,motivo,creado_por)
  select id,p_vigente_desde,p_monto_mensual,p_dia_cobro,moneda,p_motivo,auth.uid() from public.acuerdos_pago where id=p_acuerdo_id
  on conflict (acuerdo_id,vigente_desde) do update set monto_mensual=excluded.monto_mensual,dia_cobro=excluded.dia_cobro,motivo=excluded.motivo,creado_por=excluded.creado_por;
  if not found then raise exception 'Acuerdo no encontrado'; end if;
  update public.acuerdos_pago set monto_mensual=p_monto_mensual,dia_cobro=p_dia_cobro,motivo_ajuste=p_motivo where id=p_acuerdo_id;
  insert into public.auditoria_financiera(entidad, entidad_id, accion, detalle, actor_id) values ('acuerdo',p_acuerdo_id,'condiciones_actualizadas',jsonb_build_object('vigente_desde',p_vigente_desde,'monto',p_monto_mensual,'dia',p_dia_cobro),auth.uid());
end; $$;

revoke all on function public.crear_cargo_extraordinario(uuid,uuid,numeric,date,text,text) from public;
revoke all on function public.condonar_cuota(uuid,text) from public;
revoke all on function public.anular_cuota(uuid,text) from public;
revoke all on function public.registrar_cobro(uuid,uuid,date,public.metodo_cobro,text,text,text,text,jsonb) from public;
revoke all on function public.reportar_cobro_portal(uuid,numeric,date,public.metodo_cobro,text,text,text) from public;
revoke all on function public.revisar_cobro(uuid,boolean,text) from public;
revoke all on function public.anular_cobro(uuid,text) from public;
revoke all on function public.actualizar_condiciones_acuerdo(uuid,date,numeric,smallint,text) from public;
grant execute on function public.crear_cargo_extraordinario(uuid,uuid,numeric,date,text,text) to authenticated;
grant execute on function public.condonar_cuota(uuid,text) to authenticated;
grant execute on function public.anular_cuota(uuid,text) to authenticated;
grant execute on function public.registrar_cobro(uuid,uuid,date,public.metodo_cobro,text,text,text,text,jsonb) to authenticated;
grant execute on function public.reportar_cobro_portal(uuid,numeric,date,public.metodo_cobro,text,text,text) to authenticated;
grant execute on function public.revisar_cobro(uuid,boolean,text) to authenticated;
grant execute on function public.anular_cobro(uuid,text) to authenticated;
grant execute on function public.actualizar_condiciones_acuerdo(uuid,date,numeric,smallint,text) to authenticated;

-- Las tablas antiguas siguen sólo en lectura mientras los clientes migran a estas RPC.
