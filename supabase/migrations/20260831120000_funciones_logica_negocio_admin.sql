create or replace function public.aprobar_matricula(
  p_inscripcion_id     uuid,
  p_monto_mensual      numeric,
  p_dia_cobro          smallint default 5,
  p_motivo_ajuste      text default null,
  p_monto_primer_mes   numeric default null
) returns void language plpgsql security definer set search_path = '' as $$
declare
  v_estudiante    uuid;
  v_acuerdo_id    uuid;
  v_mes_actual    date := date_trunc('month', current_date)::date;
  v_monto_inicial numeric(10,2);
  v_vencimiento   date;
begin
  if not public.es_admin() then
    raise exception 'Solo un administrador puede aprobar matrículas';
  end if;

  update public.inscripciones
     set estado = 'activa',
         aprobada_por = auth.uid(),
         aprobada_en = now()
   where id = p_inscripcion_id and estado = 'pendiente'
   returning estudiante_id into v_estudiante;

  if v_estudiante is null then
    raise exception 'Inscripción no encontrada o ya procesada';
  end if;

  insert into public.acuerdos_pago
    (estudiante_id, inscripcion_id, monto_mensual, dia_cobro, motivo_ajuste, acordado_por)
  values
    (v_estudiante, p_inscripcion_id, p_monto_mensual, coalesce(p_dia_cobro, 5), p_motivo_ajuste, auth.uid())
  returning id into v_acuerdo_id;

  v_monto_inicial := coalesce(p_monto_primer_mes, p_monto_mensual);
  v_vencimiento := v_mes_actual + make_interval(days => coalesce(p_dia_cobro, 5) - 1);
  if v_vencimiento < current_date then
    v_vencimiento := current_date + interval '3 days';
  end if;

  insert into public.cuotas (acuerdo_id, periodo_mes, monto, fecha_vencimiento)
  values (v_acuerdo_id, v_mes_actual, v_monto_inicial, v_vencimiento)
  on conflict (acuerdo_id, periodo_mes) do nothing;
end; $$;

grant execute on function public.aprobar_matricula(uuid, numeric, smallint, text, numeric) to authenticated;


create or replace function public.rechazar_matricula(
  p_inscripcion_id uuid,
  p_motivo         text
) returns void language plpgsql security definer set search_path = '' as $$
begin
  if not public.es_admin() then
    raise exception 'Solo un administrador puede rechazar matrículas';
  end if;

  update public.inscripciones
     set estado = 'cancelada',
         motivo_rechazo = p_motivo,
         aprobada_por = auth.uid(),
         aprobada_en = now()
   where id = p_inscripcion_id and estado = 'pendiente';

  if not found then
    raise exception 'Inscripción no encontrada o ya no se encuentra en estado pendiente';
  end if;
end; $$;

grant execute on function public.rechazar_matricula(uuid, text) to authenticated;


create or replace function public.vincular_cuenta_estudiante(
  p_estudiante_id uuid,
  p_perfil_id     uuid
) returns void language plpgsql security definer set search_path = '' as $$
begin
  if not public.es_admin() then
    raise exception 'Solo un administrador puede vincular cuentas de estudiante';
  end if;

  if exists (select 1 from public.estudiantes where perfil_id = p_perfil_id and id <> p_estudiante_id) then
    raise exception 'Ese perfil ya está vinculado a otro estudiante';
  end if;

  update public.estudiantes
     set perfil_id = p_perfil_id,
         updated_at = now()
   where id = p_estudiante_id;

  if not found then
    raise exception 'Estudiante no encontrado';
  end if;

  insert into public.perfil_rol (perfil_id, rol)
  values (p_perfil_id, 'estudiante')
  on conflict do nothing;
end; $$;

grant execute on function public.vincular_cuenta_estudiante(uuid, uuid) to authenticated;


create or replace function public.generar_sesiones_catedra(
  p_catedra_id  uuid,
  p_fecha_desde date,
  p_fecha_hasta date
) returns int language plpgsql security definer set search_path = '' as $$
declare
  v_generadas int := 0;
  v_fecha     date;
  v_dow       smallint;
  v_horario   record;
begin
  if not (public.es_admin() or exists (
    select 1 from public.catedras c where c.id = p_catedra_id and c.docente_id = auth.uid()
  )) then
    raise exception 'No tiene permisos para generar sesiones en esta cátedra';
  end if;

  if p_fecha_hasta < p_fecha_desde then
    raise exception 'La fecha final no puede ser menor a la fecha inicial';
  end if;

  for v_fecha in select generate_series(p_fecha_desde, p_fecha_hasta, interval '1 day')::date loop
    v_dow := extract(dow from v_fecha)::smallint;

    for v_horario in
      select hora_inicio, hora_fin
        from public.catedra_horarios
       where catedra_id = p_catedra_id and dia_semana = v_dow
    loop
      insert into public.sesiones (catedra_id, fecha, hora_inicio, hora_fin, estado)
      values (p_catedra_id, v_fecha, v_horario.hora_inicio, v_horario.hora_fin, 'programada')
      on conflict (catedra_id, fecha, hora_inicio) do nothing;

      if found then
        v_generadas := v_generadas + 1;
      end if;
    end loop;
  end loop;

  return v_generadas;
end; $$;

grant execute on function public.generar_sesiones_catedra(uuid, date, date) to authenticated;


create or replace function public.recalcular_progreso_inscripcion()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  v_inscripcion uuid := coalesce(new.inscripcion_id, old.inscripcion_id);
  v_curso_id    uuid;
  v_total       int;
  v_completadas int;
  v_pct         numeric(5,2);
begin
  select c.curso_id into v_curso_id
    from public.inscripciones i
    join public.catedras c on c.id = i.catedra_id
   where i.id = v_inscripcion;

  if v_curso_id is null then
    return null;
  end if;

  select count(cl.id) into v_total
    from public.curso_modulos cm
    join public.curso_lecciones cl on cl.modulo_id = cm.id
   where cm.curso_id = v_curso_id;

  select count(*) into v_completadas
    from public.progreso_lecciones
   where inscripcion_id = v_inscripcion and completada = true;

  v_pct := case when v_total > 0 then round((v_completadas::numeric / v_total::numeric) * 100, 2) else 0 end;

  update public.inscripciones
     set progreso_pct = least(greatest(v_pct, 0), 100)
   where id = v_inscripcion;

  return null;
end; $$;

drop trigger if exists trg_progreso_lecciones_recalcula on public.progreso_lecciones;
create trigger trg_progreso_lecciones_recalcula
after insert or update or delete on public.progreso_lecciones
for each row execute function public.recalcular_progreso_inscripcion();


create or replace function public.emitir_certificado(
  p_inscripcion_id uuid,
  p_forzar         boolean default false
) returns text language plpgsql security definer set search_path = '' as $$
declare
  v_progreso  numeric(5,2);
  v_codigo    text;
  v_existente text;
begin
  if not public.es_admin() then
    raise exception 'Solo un administrador puede emitir certificados';
  end if;

  select codigo_verificacion into v_existente
    from public.certificados
   where inscripcion_id = p_inscripcion_id;

  if v_existente is not null then
    return v_existente;
  end if;

  select progreso_pct into v_progreso
    from public.inscripciones
   where id = p_inscripcion_id;

  if v_progreso is null then
    raise exception 'Inscripción no encontrada';
  end if;

  if not p_forzar and v_progreso < 100 then
    raise exception 'El estudiante no ha completado el 100%% del temario (progreso actual: % %%)', v_progreso;
  end if;

  v_codigo := 'GOS-' || to_char(current_date, 'YYYY') || '-' || upper(substring(encode(gen_random_bytes(4), 'hex') from 1 for 6));

  insert into public.certificados (inscripcion_id, codigo_verificacion, fecha_emision)
  values (p_inscripcion_id, v_codigo, current_date);

  update public.inscripciones
     set estado = 'finalizada',
         fecha_fin = coalesce(fecha_fin, current_date)
   where id = p_inscripcion_id;

  return v_codigo;
end; $$;

grant execute on function public.emitir_certificado(uuid, boolean) to authenticated;


create or replace function public.dar_de_baja_estudiante(
  p_inscripcion_id               uuid,
  p_motivo                       text default null,
  p_condonar_cuotas_pendientes   boolean default false
) returns void language plpgsql security definer set search_path = '' as $$
declare
  v_acuerdo_id uuid;
begin
  if not public.es_admin() then
    raise exception 'Solo un administrador puede tramitar la baja de un estudiante';
  end if;

  update public.inscripciones
     set estado = 'retirada',
         fecha_fin = coalesce(fecha_fin, current_date)
   where id = p_inscripcion_id;

  if not found then
    raise exception 'Inscripción no encontrada';
  end if;

  update public.acuerdos_pago
     set estado = 'finalizado',
         fecha_fin = coalesce(fecha_fin, current_date),
         observaciones = concat_ws(' | ', observaciones, coalesce(p_motivo, 'Retiro administrativo'))
   where inscripcion_id = p_inscripcion_id and estado = 'vigente'
   returning id into v_acuerdo_id;

  if p_condonar_cuotas_pendientes and v_acuerdo_id is not null then
    update public.cuotas
       set estado = 'condonada'
     where acuerdo_id = v_acuerdo_id and estado in ('pendiente', 'parcial');
  end if;
end; $$;

grant execute on function public.dar_de_baja_estudiante(uuid, text, boolean) to authenticated;


create or replace function public.convertir_solicitud_lead(
  p_solicitud_id uuid,
  p_catedra_id   uuid default null
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_sol            public.solicitudes%rowtype;
  v_repre_id       uuid;
  v_estudiante_id  uuid;
  v_inscripcion_id uuid;
  v_nombres        text;
  v_apellidos      text;
  v_partes         text[];
begin
  if not public.es_admin() then
    raise exception 'Solo un administrador puede convertir solicitudes de prospectos';
  end if;

  select * into v_sol from public.solicitudes where id = p_solicitud_id;

  if not found then
    raise exception 'Solicitud no encontrada';
  end if;

  if v_sol.estado = 'convertida' then
    raise exception 'La solicitud ya ha sido convertida previamente';
  end if;

  if v_sol.para_menor then
    select id into v_repre_id
      from public.representantes
     where email = v_sol.email or (celular is not null and celular = v_sol.telefono)
     limit 1;

    if v_repre_id is null then
      v_partes := string_to_array(coalesce(trim(v_sol.nombre_completo), 'Representante'), ' ');
      v_nombres := v_partes[1];
      v_apellidos := coalesce(array_to_string(v_partes[2:], ' '), 'Pendiente');

      insert into public.representantes (nombres, apellidos, email, celular)
      values (v_nombres, v_apellidos, v_sol.email, v_sol.telefono)
      returning id into v_repre_id;
    end if;

    v_partes := string_to_array(coalesce(trim(v_sol.estudiante_nombre), 'Estudiante'), ' ');
    v_nombres := v_partes[1];
    v_apellidos := coalesce(array_to_string(v_partes[2:], ' '), 'Pendiente');

    insert into public.estudiantes (nombres, apellidos, fecha_nacimiento)
    values (v_nombres, v_apellidos, coalesce(v_sol.estudiante_fecha_nacimiento, current_date - interval '10 years')::date)
    returning id into v_estudiante_id;

    insert into public.estudiante_representante (estudiante_id, representante_id, parentesco, es_contacto_principal)
    values (v_estudiante_id, v_repre_id, coalesce(v_sol.parentesco, 'tutor_legal'), true)
    on conflict do nothing;

  else
    v_partes := string_to_array(coalesce(trim(v_sol.nombre_completo), 'Estudiante'), ' ');
    v_nombres := v_partes[1];
    v_apellidos := coalesce(array_to_string(v_partes[2:], ' '), 'Pendiente');

    insert into public.estudiantes (nombres, apellidos, email, celular, fecha_nacimiento)
    values (v_nombres, v_apellidos, v_sol.email, v_sol.telefono, current_date - interval '20 years')
    returning id into v_estudiante_id;
  end if;

  if p_catedra_id is not null then
    insert into public.inscripciones (estudiante_id, catedra_id, estado)
    values (v_estudiante_id, p_catedra_id, 'pendiente')
    returning id into v_inscripcion_id;
  end if;

  update public.solicitudes
     set estado = 'convertida',
         atendida_por = auth.uid()
   where id = p_solicitud_id;

  return jsonb_build_object(
    'solicitud_id', p_solicitud_id,
    'estudiante_id', v_estudiante_id,
    'representante_id', v_repre_id,
    'inscripcion_id', v_inscripcion_id
  );
end; $$;

grant execute on function public.convertir_solicitud_lead(uuid, uuid) to authenticated;


create or replace view public.v_estudiantes_emancipables as
select
  e.id as estudiante_id,
  e.nombres || ' ' || e.apellidos as estudiante,
  e.fecha_nacimiento,
  extract(year from age(current_date, e.fecha_nacimiento))::int as edad,
  e.email as email_estudiante,
  e.cedula,
  p.id as perfil_sugerido,
  p.nombres || ' ' || p.apellidos as perfil_nombre,
  p.email as perfil_email
from public.estudiantes e
left join public.perfiles p on (lower(p.email) = lower(e.email) or (e.cedula is not null and p.cedula = e.cedula))
where e.perfil_id is null
  and e.fecha_nacimiento <= current_date - interval '18 years';

alter view public.v_estudiantes_emancipables set (security_invoker = on);


create or replace view public.v_resenas_pendientes as
select
  r.id as resena_id,
  r.curso_id,
  c.nombre as curso_nombre,
  r.estudiante_id,
  e.nombres || ' ' || e.apellidos as estudiante_nombre,
  r.puntuacion,
  r.comentario,
  r.created_at
from public.curso_resenas r
join public.cursos c on c.id = r.curso_id
join public.estudiantes e on e.id = r.estudiante_id
where r.publicado = false;

alter view public.v_resenas_pendientes set (security_invoker = on);


create or replace function public.matricular_estudiante_directo(
  p_estudiante_id      uuid,
  p_catedra_id         uuid,
  p_monto_mensual      numeric,
  p_dia_cobro          smallint default 5,
  p_motivo_ajuste      text default null,
  p_monto_primer_mes   numeric default null
) returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_inscripcion_id uuid;
  v_acuerdo_id     uuid;
  v_mes_actual     date := date_trunc('month', current_date)::date;
  v_monto_inicial  numeric(10,2);
  v_vencimiento    date;
begin
  if not public.es_admin() then
    raise exception 'Solo un administrador puede matricular estudiantes directamente';
  end if;

  select id into v_inscripcion_id
    from public.inscripciones
   where estudiante_id = p_estudiante_id
     and catedra_id = p_catedra_id
     and estado in ('activa', 'pendiente');

  if v_inscripcion_id is not null then
    raise exception 'El estudiante ya tiene una matrícula activa o pendiente en esta cátedra';
  end if;

  insert into public.inscripciones
    (estudiante_id, catedra_id, estado, fecha_inscripcion, aprobada_por, aprobada_en)
  values
    (p_estudiante_id, p_catedra_id, 'activa', current_date, auth.uid(), now())
  returning id into v_inscripcion_id;

  if p_monto_mensual is not null and p_monto_mensual > 0 then
    insert into public.acuerdos_pago
      (estudiante_id, inscripcion_id, monto_mensual, dia_cobro, motivo_ajuste, acordado_por)
    values
      (p_estudiante_id, v_inscripcion_id, p_monto_mensual, coalesce(p_dia_cobro, 5), p_motivo_ajuste, auth.uid())
    returning id into v_acuerdo_id;

    v_monto_inicial := coalesce(p_monto_primer_mes, p_monto_mensual);
    v_vencimiento := v_mes_actual + make_interval(days => coalesce(p_dia_cobro, 5) - 1);
    if v_vencimiento < current_date then
      v_vencimiento := current_date + interval '3 days';
    end if;

    insert into public.cuotas (acuerdo_id, periodo_mes, monto, fecha_vencimiento)
    values (v_acuerdo_id, v_mes_actual, v_monto_inicial, v_vencimiento)
    on conflict (acuerdo_id, periodo_mes) do nothing;
  end if;

  return v_inscripcion_id;
end; $$;

grant execute on function public.matricular_estudiante_directo(uuid, uuid, numeric, smallint, text, numeric) to authenticated;

