-- Operaciones seguras para acuerdos y vínculos de responsables.
create or replace function public.actualizar_acuerdo_administrativo(
  p_acuerdo_id uuid, p_estado public.estado_acuerdo, p_fecha_fin date, p_observaciones text
) returns void language plpgsql security definer set search_path='' as $$
begin
  if not public.es_admin() then raise exception 'Solo un administrador puede actualizar acuerdos'; end if;
  if p_estado='finalizado' then raise exception 'Use el cierre de acuerdo para finalizar y resolver sus cuotas'; end if;
  update public.acuerdos_pago set estado=p_estado,fecha_fin=p_fecha_fin,observaciones=nullif(trim(p_observaciones),'') where id=p_acuerdo_id;
  if not found then raise exception 'Acuerdo no encontrado'; end if;
  insert into public.auditoria_financiera(entidad,entidad_id,accion,detalle,actor_id) values ('acuerdo',p_acuerdo_id,'actualizado_administrativo',jsonb_build_object('estado',p_estado,'fecha_fin',p_fecha_fin),auth.uid());
end $$;

create or replace function public.vincular_representante_estudiante(
 p_estudiante_id uuid,p_representante_id uuid,p_parentesco public.parentesco,p_contacto_principal boolean,p_autoriza_retiro boolean
) returns void language plpgsql security definer set search_path='' as $$
begin
 if not public.es_admin() then raise exception 'Solo un administrador puede gestionar vínculos'; end if;
 if p_contacto_principal then update public.estudiante_representante set es_contacto_principal=false where estudiante_id=p_estudiante_id; end if;
 insert into public.estudiante_representante(estudiante_id,representante_id,parentesco,es_contacto_principal,autoriza_retiro)
 values(p_estudiante_id,p_representante_id,p_parentesco,p_contacto_principal,p_autoriza_retiro)
 on conflict(estudiante_id,representante_id) do update set parentesco=excluded.parentesco,es_contacto_principal=excluded.es_contacto_principal,autoriza_retiro=excluded.autoriza_retiro;
end $$;

create or replace function public.desvincular_representante_estudiante(p_estudiante_id uuid,p_representante_id uuid)
returns void language plpgsql security definer set search_path='' as $$
begin
 if not public.es_admin() then raise exception 'Solo un administrador puede gestionar vínculos'; end if;
 if exists(select 1 from public.acuerdos_pago where estudiante_id=p_estudiante_id and responsable_representante_id=p_representante_id and estado='vigente') then raise exception 'No puede desvincular al responsable de un acuerdo vigente'; end if;
 delete from public.estudiante_representante where estudiante_id=p_estudiante_id and representante_id=p_representante_id;
end $$;

grant execute on function public.actualizar_acuerdo_administrativo(uuid,public.estado_acuerdo,date,text),public.vincular_representante_estudiante(uuid,uuid,public.parentesco,boolean,boolean),public.desvincular_representante_estudiante(uuid,uuid) to authenticated;
