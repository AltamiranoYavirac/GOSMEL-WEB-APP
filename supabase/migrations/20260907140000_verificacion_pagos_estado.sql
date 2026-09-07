-- Migración: estado de verificación en pagos y recálculo de cuotas

alter table public.pagos 
  add column if not exists estado text not null default 'aprobado'
  check (estado in ('pendiente_verificacion', 'aprobado', 'rechazado'));

update public.pagos set estado = 'aprobado' where estado is null or estado = '';

create or replace function public.recalcular_cuota()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  v_cuota  uuid := coalesce(new.cuota_id, old.cuota_id);
  v_total  numeric(10,2);
  v_monto  numeric(10,2);
begin
  select coalesce(sum(monto), 0) into v_total 
    from public.pagos 
   where cuota_id = v_cuota and estado = 'aprobado';

  select monto into v_monto from public.cuotas where id = v_cuota;

  update public.cuotas set
    monto_pagado = v_total,
    fecha_pago = case when v_total >= v_monto
      then (select max(fecha_pago) from public.pagos where cuota_id = v_cuota and estado = 'aprobado') else null end,
    estado = case when v_total >= v_monto then 'pagada'::public.estado_cuota
                  when v_total > 0        then 'parcial'::public.estado_cuota
                  else 'pendiente'::public.estado_cuota end
  where id = v_cuota and estado <> 'condonada';
  return null;
end; $$;
