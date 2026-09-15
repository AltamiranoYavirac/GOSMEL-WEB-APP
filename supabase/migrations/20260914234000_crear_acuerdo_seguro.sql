-- El alta manual de acuerdos es una operación financiera auditada; no se permite
-- insertar la tabla directamente desde el navegador.
create or replace function public.crear_acuerdo_pago(
  p_estudiante_id uuid,
  p_responsable_representante_id uuid,
  p_monto_mensual numeric,
  p_dia_cobro smallint,
  p_fecha_inicio date,
  p_fecha_fin date,
  p_motivo_ajuste text,
  p_observaciones text
) returns uuid language plpgsql security definer set search_path='' as $$
declare
  v_id uuid;
  v_inicio_minimo date := (date_trunc('month', current_date) + interval '1 month')::date;
begin
  if not public.es_admin() then raise exception 'Solo un administrador puede crear acuerdos'; end if;
  if p_monto_mensual <= 0 then raise exception 'La mensualidad debe ser mayor a cero'; end if;
  if p_dia_cobro not between 1 and 28 then raise exception 'El día de cobro debe estar entre 1 y 28'; end if;
  if p_fecha_inicio < v_inicio_minimo then raise exception 'Los acuerdos nuevos empiezan como mínimo el siguiente mes'; end if;
  if p_fecha_fin is not null and p_fecha_fin < p_fecha_inicio then raise exception 'La fecha de fin no puede ser anterior al inicio'; end if;
  if not exists (select 1 from public.estudiantes where id=p_estudiante_id) then raise exception 'Estudiante no encontrado'; end if;
  if p_responsable_representante_id is not null and not exists (
    select 1 from public.estudiante_representante
    where estudiante_id=p_estudiante_id and representante_id=p_responsable_representante_id
  ) then raise exception 'El responsable debe estar vinculado al estudiante'; end if;

  insert into public.acuerdos_pago(
    estudiante_id,responsable_representante_id,monto_mensual,dia_cobro,
    fecha_inicio,fecha_fin,motivo_ajuste,observaciones,estado,acordado_por
  ) values (
    p_estudiante_id,p_responsable_representante_id,p_monto_mensual,p_dia_cobro,
    p_fecha_inicio,p_fecha_fin,nullif(trim(p_motivo_ajuste),''),
    nullif(trim(p_observaciones),''),'vigente',auth.uid()
  ) returning id into v_id;

  insert into public.acuerdo_condiciones(
    acuerdo_id,vigente_desde,monto_mensual,dia_cobro,motivo,creado_por
  ) values (
    v_id,p_fecha_inicio,p_monto_mensual,p_dia_cobro,
    coalesce(nullif(trim(p_motivo_ajuste),''),'Creación administrativa'),auth.uid()
  );
  insert into public.auditoria_financiera(entidad,entidad_id,accion,detalle,actor_id)
  values ('acuerdo',v_id,'creado',jsonb_build_object('estudiante_id',p_estudiante_id,'inicio',p_fecha_inicio),auth.uid());
  return v_id;
end $$;

grant execute on function public.crear_acuerdo_pago(uuid,uuid,numeric,smallint,date,date,text,text) to authenticated;
