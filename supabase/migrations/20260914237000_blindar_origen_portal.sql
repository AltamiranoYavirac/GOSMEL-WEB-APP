-- registrar_cobro es el motor compartido: el origen portal debe verificar acceso
-- incluso si alguien intenta invocarlo directamente por RPC.
create or replace function public.registrar_cobro(
  p_responsable_representante_id uuid, p_responsable_estudiante_id uuid, p_fecha_pago date,
  p_metodo public.metodo_cobro, p_referencia text, p_comprobante_storage_path text,
  p_observacion text, p_origen text, p_aplicaciones jsonb
) returns uuid language plpgsql security definer set search_path='' as $$
declare v_cobro_id uuid; v_total numeric(10,2); v_aplicacion record; v_cuota record;
begin
  if p_origen='admin' and not public.es_admin() then raise exception 'Solo un administrador puede registrar este cobro'; end if;
  if p_origen not in ('admin','portal') then raise exception 'Origen inválido'; end if;
  if (p_responsable_representante_id is null)=(p_responsable_estudiante_id is null) then raise exception 'Debe indicar un único responsable de pago'; end if;
  if p_origen='portal' and coalesce(trim(p_comprobante_storage_path),'')='' then raise exception 'El comprobante es obligatorio'; end if;
  if p_origen='portal' and exists(
    select 1 from jsonb_to_recordset(p_aplicaciones) as x(cuota_id uuid,monto numeric)
    join public.cuotas c on c.id=x.cuota_id
    where not exists(select 1 from public.estudiantes_accesibles() e where e=c.estudiante_id)
  ) then raise exception 'No puede reportar pagos para una cuota ajena'; end if;
  select coalesce(sum(x.monto),0) into v_total from jsonb_to_recordset(p_aplicaciones) as x(cuota_id uuid,monto numeric);
  if v_total<=0 then raise exception 'Debe aplicar un monto positivo a una o más cuotas'; end if;
  for v_aplicacion in select * from jsonb_to_recordset(p_aplicaciones) as x(cuota_id uuid,monto numeric) loop
    if v_aplicacion.monto<=0 then raise exception 'Cada aplicación debe ser positiva'; end if;
    select c.id,c.monto,c.monto_pagado,c.estado,c.responsable_representante_id,c.estudiante_id into v_cuota from public.cuotas c where c.id=v_aplicacion.cuota_id for update;
    if not found or v_cuota.estado not in ('pendiente','parcial') then raise exception 'Una cuota no está disponible para cobro'; end if;
    if v_cuota.responsable_representante_id is distinct from p_responsable_representante_id or (v_cuota.responsable_representante_id is null and v_cuota.estudiante_id is distinct from p_responsable_estudiante_id) then raise exception 'Todas las cuotas deben pertenecer al responsable seleccionado'; end if;
    if v_aplicacion.monto>v_cuota.monto-v_cuota.monto_pagado then raise exception 'No se permiten sobrepagos'; end if;
  end loop;
  insert into public.cobros(responsable_representante_id,responsable_estudiante_id,monto_total,fecha_pago,metodo,referencia,comprobante_storage_path,estado,origen,observacion,registrado_por)
  values(p_responsable_representante_id,p_responsable_estudiante_id,v_total,coalesce(p_fecha_pago,current_date),p_metodo,p_referencia,p_comprobante_storage_path,case when p_origen='portal' then 'pendiente_verificacion'::public.estado_cobro else 'aprobado'::public.estado_cobro end,p_origen,p_observacion,auth.uid()) returning id into v_cobro_id;
  insert into public.cobro_aplicaciones(cobro_id,cuota_id,monto) select v_cobro_id,x.cuota_id,x.monto from jsonb_to_recordset(p_aplicaciones) as x(cuota_id uuid,monto numeric);
  insert into public.auditoria_financiera(entidad,entidad_id,accion,detalle,actor_id) values('cobro',v_cobro_id,'registrado',jsonb_build_object('origen',p_origen,'monto',v_total),auth.uid());
  return v_cobro_id;
end $$;
revoke all on function public.registrar_cobro(uuid,uuid,date,public.metodo_cobro,text,text,text,text,jsonb) from public, anon;
grant execute on function public.registrar_cobro(uuid,uuid,date,public.metodo_cobro,text,text,text,text,jsonb) to authenticated;
