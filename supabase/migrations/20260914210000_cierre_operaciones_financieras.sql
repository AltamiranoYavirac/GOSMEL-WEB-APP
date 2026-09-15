-- Cierre de operaciones financieras: no hay mutaciones directas ni borrados de historial.
alter table public.cobros add column if not exists numero_recibo text unique;
create table if not exists public.ejecuciones_generacion_cuotas (
  id uuid primary key default gen_random_uuid(), mes date not null, origen text not null check (origen in ('admin','cron')),
  estado text not null check (estado in ('ejecutando','completada','fallida')), creadas integer not null default 0,
  error text, ejecutado_por uuid references public.perfiles(id) on delete set null, created_at timestamptz not null default now(), finished_at timestamptz,
  unique(mes, origen, created_at)
);

create or replace function public.editar_cuota(p_cuota_id uuid,p_monto numeric,p_fecha_vencimiento date,p_motivo text)
returns void language plpgsql security definer set search_path='' as $$
declare v_pagado numeric;
begin
 if not public.es_admin() then raise exception 'Solo un administrador puede editar cuotas'; end if;
 if coalesce(trim(p_motivo),'')='' or p_monto<=0 then raise exception 'Monto y motivo son obligatorios'; end if;
 select monto_pagado into v_pagado from public.cuotas where id=p_cuota_id for update;
 if not found then raise exception 'Cuota no encontrada'; end if;
 if p_monto<v_pagado then raise exception 'El monto no puede ser menor a lo ya cobrado'; end if;
 update public.cuotas set monto=p_monto,fecha_vencimiento=p_fecha_vencimiento where id=p_cuota_id and estado in ('pendiente','parcial');
 if not found then raise exception 'Solo se editan cuotas pendientes o parciales'; end if;
 perform public.recalcular_cuota_desde_cobros(p_cuota_id);
 insert into public.auditoria_financiera(entidad,entidad_id,accion,detalle,actor_id) values('cuota',p_cuota_id,'editada',jsonb_build_object('monto',p_monto,'vencimiento',p_fecha_vencimiento,'motivo',p_motivo),auth.uid());
end $$;

create or replace function public.restaurar_cuota_condonada(p_cuota_id uuid,p_motivo text)
returns void language plpgsql security definer set search_path='' as $$
begin
 if not public.es_admin() then raise exception 'Solo un administrador puede restaurar cuotas'; end if;
 if coalesce(trim(p_motivo),'')='' then raise exception 'El motivo es obligatorio'; end if;
 update public.cuotas set estado='pendiente',condonada_por=null,condonada_en=null,motivo_condonacion=null where id=p_cuota_id and estado='condonada';
 if not found then raise exception 'Solo se restauran cuotas condonadas'; end if;
 perform public.recalcular_cuota_desde_cobros(p_cuota_id);
 insert into public.auditoria_financiera(entidad,entidad_id,accion,detalle,actor_id) values('cuota',p_cuota_id,'restaurada',jsonb_build_object('motivo',p_motivo),auth.uid());
end $$;

create or replace function public.cambiar_responsable_acuerdo(p_acuerdo_id uuid,p_representante_id uuid,p_motivo text)
returns void language plpgsql security definer set search_path='' as $$
declare v_estudiante uuid;
begin
 if not public.es_admin() then raise exception 'Solo un administrador puede cambiar responsables'; end if;
 if coalesce(trim(p_motivo),'')='' then raise exception 'El motivo es obligatorio'; end if;
 select estudiante_id into v_estudiante from public.acuerdos_pago where id=p_acuerdo_id for update;
 if not found then raise exception 'Acuerdo no encontrado'; end if;
 if p_representante_id is not null and not exists(select 1 from public.estudiante_representante where estudiante_id=v_estudiante and representante_id=p_representante_id) then raise exception 'El responsable no está vinculado al estudiante'; end if;
 update public.acuerdos_pago set responsable_representante_id=p_representante_id where id=p_acuerdo_id;
 update public.cuotas set responsable_representante_id=p_representante_id where acuerdo_id=p_acuerdo_id and estado in ('pendiente','parcial');
 insert into public.auditoria_financiera(entidad,entidad_id,accion,detalle,actor_id) values('acuerdo',p_acuerdo_id,'responsable_cambiado',jsonb_build_object('representante_id',p_representante_id,'motivo',p_motivo),auth.uid());
end $$;

create or replace function public.cerrar_acuerdo(p_acuerdo_id uuid,p_resoluciones jsonb,p_motivo text)
returns void language plpgsql security definer set search_path='' as $$
declare r record;
begin
 if not public.es_admin() then raise exception 'Solo un administrador puede cerrar acuerdos'; end if;
 if coalesce(trim(p_motivo),'')='' then raise exception 'El motivo es obligatorio'; end if;
 for r in select * from jsonb_to_recordset(p_resoluciones) as x(cuota_id uuid,accion text,motivo text) loop
   if r.accion='anular' then perform public.anular_cuota(r.cuota_id,coalesce(r.motivo,p_motivo));
   elsif r.accion='condonar' then perform public.condonar_cuota(r.cuota_id,coalesce(r.motivo,p_motivo));
   elsif r.accion<>'mantener' then raise exception 'Resolución inválida'; end if;
 end loop;
 update public.acuerdos_pago set estado='finalizado',fecha_fin=coalesce(fecha_fin,current_date) where id=p_acuerdo_id;
 if not found then raise exception 'Acuerdo no encontrado'; end if;
 insert into public.auditoria_financiera(entidad,entidad_id,accion,detalle,actor_id) values('acuerdo',p_acuerdo_id,'cerrado',jsonb_build_object('motivo',p_motivo),auth.uid());
end $$;

-- Staging está vacío: retirar el canal legacy sin datos financieros.
drop policy if exists "reporte de pago del estudiante" on public.pagos;
drop table public.pagos;
revoke all on public.cuotas from authenticated;
revoke all on public.acuerdos_pago from authenticated;
grant select on public.cuotas, public.acuerdos_pago to authenticated;
grant execute on function public.editar_cuota(uuid,numeric,date,text), public.restaurar_cuota_condonada(uuid,text), public.cambiar_responsable_acuerdo(uuid,uuid,text), public.cerrar_acuerdo(uuid,jsonb,text) to authenticated;
