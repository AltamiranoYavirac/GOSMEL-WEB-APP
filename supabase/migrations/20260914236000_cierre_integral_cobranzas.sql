-- Cierre de seguridad, consistencia y reglas transaccionales de cobranzas.

-- Ninguna función SECURITY DEFINER debe quedar publicada por el privilegio PUBLIC.
revoke all on function public.generar_cuotas_mes_cron() from public, anon, authenticated;
revoke all on function public.recalcular_cuota_desde_cobros(uuid) from public, anon, authenticated;
revoke all on function public.recalcular_cuotas_cobro() from public, anon, authenticated;
revoke all on function public.crear_acuerdo_pago(uuid,uuid,numeric,smallint,date,date,text,text) from public, anon;
revoke all on function public.cerrar_acuerdo(uuid,jsonb,text) from public, anon;
revoke all on function public.registrar_cobro(uuid,uuid,date,public.metodo_cobro,text,text,text,text,jsonb) from public, anon;
revoke all on function public.reportar_cobro_portal(uuid,numeric,date,public.metodo_cobro,text,text,text) from public, anon;

-- Escrituras solo mediante RPC auditadas; las vistas son de solo lectura.
revoke insert, update, delete on public.cobros, public.cobro_aplicaciones, public.auditoria_financiera from authenticated;
revoke insert, update, delete on public.v_estado_cuenta, public.v_cobranza_responsables from authenticated;
alter table public.ejecuciones_generacion_cuotas enable row level security;
revoke all on public.ejecuciones_generacion_cuotas from authenticated;
grant select on public.ejecuciones_generacion_cuotas to authenticated;
drop policy if exists "admin lee ejecuciones de cuotas" on public.ejecuciones_generacion_cuotas;
create policy "admin lee ejecuciones de cuotas" on public.ejecuciones_generacion_cuotas
  for select to authenticated using (public.es_admin());

-- Un acuerdo comienza siempre el primer día del mes configurado y deja su primera condición válida.
create or replace function public.crear_acuerdo_pago(
  p_estudiante_id uuid, p_responsable_representante_id uuid, p_monto_mensual numeric,
  p_dia_cobro smallint, p_fecha_inicio date, p_fecha_fin date, p_motivo_ajuste text,
  p_observaciones text
) returns uuid language plpgsql security definer set search_path='' as $$
declare v_id uuid;
begin
  if not public.es_admin() then raise exception 'Solo un administrador puede crear acuerdos'; end if;
  if p_monto_mensual <= 0 or p_dia_cobro not between 1 and 28 then raise exception 'Condiciones inválidas'; end if;
  if p_fecha_inicio <> date_trunc('month', p_fecha_inicio)::date then raise exception 'El acuerdo debe iniciar el primer día del mes'; end if;
  if p_fecha_inicio < (date_trunc('month', current_date) + interval '1 month')::date then raise exception 'Los acuerdos nuevos empiezan como mínimo el siguiente mes'; end if;
  if p_fecha_fin is not null and p_fecha_fin < p_fecha_inicio then raise exception 'La fecha de fin no puede ser anterior al inicio'; end if;
  if not exists (select 1 from public.estudiantes where id=p_estudiante_id) then raise exception 'Estudiante no encontrado'; end if;
  if exists (select 1 from public.acuerdos_pago where estudiante_id=p_estudiante_id and inscripcion_id is not null and estado='vigente') then raise exception 'El estudiante ya tiene un acuerdo vigente asociado a una matrícula'; end if;
  if p_responsable_representante_id is not null and not exists (select 1 from public.estudiante_representante where estudiante_id=p_estudiante_id and representante_id=p_responsable_representante_id) then raise exception 'El responsable debe estar vinculado al estudiante'; end if;
  insert into public.acuerdos_pago(estudiante_id,responsable_representante_id,monto_mensual,dia_cobro,fecha_inicio,fecha_fin,motivo_ajuste,observaciones,estado,acordado_por)
  values(p_estudiante_id,p_responsable_representante_id,p_monto_mensual,p_dia_cobro,p_fecha_inicio,p_fecha_fin,nullif(trim(p_motivo_ajuste),''),nullif(trim(p_observaciones),''),'vigente',auth.uid()) returning id into v_id;
  insert into public.acuerdo_condiciones(acuerdo_id,vigente_desde,monto_mensual,dia_cobro,moneda,motivo,creado_por)
  values(v_id,p_fecha_inicio,p_monto_mensual,p_dia_cobro,'USD',coalesce(nullif(trim(p_motivo_ajuste),''),'Creación administrativa'),auth.uid());
  insert into public.auditoria_financiera(entidad,entidad_id,accion,detalle,actor_id) values('acuerdo',v_id,'creado',jsonb_build_object('estudiante_id',p_estudiante_id,'inicio',p_fecha_inicio),auth.uid());
  return v_id;
end $$;

-- Actualización administrativa y condición histórica en una única transacción.
create or replace function public.actualizar_acuerdo_completo(
  p_acuerdo_id uuid, p_monto_mensual numeric, p_dia_cobro smallint, p_vigente_desde date,
  p_estado public.estado_acuerdo, p_fecha_fin date, p_motivo text, p_observaciones text
) returns void language plpgsql security definer set search_path='' as $$
declare v_moneda char(3);
begin
  if not public.es_admin() then raise exception 'Solo un administrador puede actualizar acuerdos'; end if;
  if p_estado='finalizado' then raise exception 'Use el cierre de acuerdo para finalizar y resolver sus cuotas'; end if;
  if p_monto_mensual<=0 or p_dia_cobro not between 1 and 28 then raise exception 'Condiciones inválidas'; end if;
  if p_vigente_desde<>date_trunc('month',p_vigente_desde)::date or p_vigente_desde<date_trunc('month',current_date)::date then raise exception 'La vigencia debe iniciar este mes o uno futuro'; end if;
  select moneda into v_moneda from public.acuerdos_pago where id=p_acuerdo_id for update;
  if not found then raise exception 'Acuerdo no encontrado'; end if;
  if p_fecha_fin is not null and p_fecha_fin < p_vigente_desde then raise exception 'La fecha de fin no puede ser anterior a la vigencia'; end if;
  insert into public.acuerdo_condiciones(acuerdo_id,vigente_desde,monto_mensual,dia_cobro,moneda,motivo,creado_por)
  values(p_acuerdo_id,p_vigente_desde,p_monto_mensual,p_dia_cobro,v_moneda,nullif(trim(p_motivo),''),auth.uid())
  on conflict(acuerdo_id,vigente_desde) do update set monto_mensual=excluded.monto_mensual,dia_cobro=excluded.dia_cobro,motivo=excluded.motivo,creado_por=excluded.creado_por;
  update public.acuerdos_pago set monto_mensual=p_monto_mensual,dia_cobro=p_dia_cobro,motivo_ajuste=nullif(trim(p_motivo),''),estado=p_estado,fecha_fin=p_fecha_fin,observaciones=nullif(trim(p_observaciones),'') where id=p_acuerdo_id;
  insert into public.auditoria_financiera(entidad,entidad_id,accion,detalle,actor_id) values('acuerdo',p_acuerdo_id,'actualizado',jsonb_build_object('vigente_desde',p_vigente_desde,'estado',p_estado),auth.uid());
end $$;

-- No se permite cerrar dejando cuotas pendientes sin una decisión explícita.
create or replace function public.cerrar_acuerdo(p_acuerdo_id uuid,p_resoluciones jsonb,p_motivo text)
returns void language plpgsql security definer set search_path='' as $$
declare r record; v_pendientes int; v_resueltas int;
begin
  if not public.es_admin() then raise exception 'Solo un administrador puede cerrar acuerdos'; end if;
  if coalesce(trim(p_motivo),'')='' then raise exception 'El motivo es obligatorio'; end if;
  if not exists(select 1 from public.acuerdos_pago where id=p_acuerdo_id and estado in ('vigente','suspendido') for update) then raise exception 'El acuerdo no está disponible para cierre'; end if;
  select count(*) into v_pendientes from public.cuotas where acuerdo_id=p_acuerdo_id and estado in ('pendiente','parcial');
  select count(distinct x.cuota_id) into v_resueltas from jsonb_to_recordset(coalesce(p_resoluciones,'[]'::jsonb)) as x(cuota_id uuid,accion text,motivo text)
    join public.cuotas c on c.id=x.cuota_id and c.acuerdo_id=p_acuerdo_id and c.estado in ('pendiente','parcial');
  if v_resueltas<>v_pendientes or jsonb_array_length(coalesce(p_resoluciones,'[]'::jsonb))<>v_pendientes then raise exception 'Debe resolver exactamente todas las cuotas pendientes del acuerdo'; end if;
  for r in select * from jsonb_to_recordset(coalesce(p_resoluciones,'[]'::jsonb)) as x(cuota_id uuid,accion text,motivo text) loop
    if r.accion='anular' then perform public.anular_cuota(r.cuota_id,coalesce(r.motivo,p_motivo));
    elsif r.accion='condonar' then perform public.condonar_cuota(r.cuota_id,coalesce(r.motivo,p_motivo));
    elsif r.accion<>'mantener' then raise exception 'Resolución inválida'; end if;
  end loop;
  update public.acuerdos_pago set estado='finalizado',fecha_fin=coalesce(fecha_fin,current_date) where id=p_acuerdo_id;
  insert into public.auditoria_financiera(entidad,entidad_id,accion,detalle,actor_id) values('acuerdo',p_acuerdo_id,'cerrado',jsonb_build_object('motivo',p_motivo),auth.uid());
end $$;

-- Fuente única para generación manual y programada.
create or replace function public.generar_cuotas_mes_interno(p_mes date,p_actor uuid default null)
returns integer language plpgsql security definer set search_path='' as $$
declare v_creadas int;
begin
  if p_mes<>date_trunc('month',p_mes)::date then raise exception 'El período debe ser el primer día del mes'; end if;
  insert into public.cuotas(acuerdo_id,estudiante_id,responsable_representante_id,tipo,concepto,origen,periodo_mes,monto,fecha_vencimiento,creada_por)
  select a.id,a.estudiante_id,a.responsable_representante_id,'mensualidad','Mensualidad','generacion_mensual',p_mes,c.monto_mensual,(p_mes+make_interval(days=>c.dia_cobro-1))::date,p_actor
  from public.acuerdos_pago a join lateral(select * from public.acuerdo_condiciones x where x.acuerdo_id=a.id and x.vigente_desde<=p_mes order by x.vigente_desde desc limit 1)c on true
  where a.estado='vigente' and a.fecha_inicio<=p_mes and (a.fecha_fin is null or a.fecha_fin>=p_mes)
  on conflict(acuerdo_id,periodo_mes) where tipo='mensualidad' and estado<>'anulada' do nothing;
  get diagnostics v_creadas=row_count; return v_creadas;
end $$;
create or replace function public.generar_cuotas_mes(p_mes date) returns integer language plpgsql security definer set search_path='' as $$ begin if not public.es_admin() then raise exception 'Solo un administrador puede generar cuotas'; end if; return public.generar_cuotas_mes_interno(p_mes,auth.uid()); end $$;
create or replace function public.generar_cuotas_mes_cron() returns void language plpgsql security definer set search_path='' as $$
declare v_mes date:=date_trunc('month',current_date)::date; v_id uuid; v_creadas int;
begin
  insert into public.ejecuciones_generacion_cuotas(mes,origen,estado) values(v_mes,'cron','ejecutando') returning id into v_id;
  begin
    v_creadas:=public.generar_cuotas_mes_interno(v_mes,null);
    update public.ejecuciones_generacion_cuotas set estado='completada',creadas=v_creadas,finished_at=now() where id=v_id;
  exception when others then
    update public.ejecuciones_generacion_cuotas set estado='fallida',error=sqlerrm,finished_at=now() where id=v_id;
  end;
end $$;

revoke all on function public.generar_cuotas_mes_interno(date,uuid), public.actualizar_acuerdo_completo(uuid,numeric,smallint,date,public.estado_acuerdo,date,text,text) from public, anon;
grant execute on function public.crear_acuerdo_pago(uuid,uuid,numeric,smallint,date,date,text,text), public.actualizar_acuerdo_completo(uuid,numeric,smallint,date,public.estado_acuerdo,date,text,text), public.cerrar_acuerdo(uuid,jsonb,text), public.generar_cuotas_mes(date) to authenticated;
