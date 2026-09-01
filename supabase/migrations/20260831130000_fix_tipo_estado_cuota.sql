-- ============================================================================
-- Corrección del tipo enum 'estado_cuota' y sincronización de cuotas/pagos
-- ============================================================================

-- 1. Crear el enum 'estado_cuota' en el schema public si no existe
do $$
begin
  if not exists (select 1 from pg_type where typname = 'estado_cuota') then
    create type public.estado_cuota as enum ('pendiente', 'parcial', 'pagada', 'condonada');
  end if;
end $$;

-- 2. Asegurar que la columna 'estado' en la tabla 'cuotas' use public.estado_cuota
do $$
begin
  alter table if exists public.cuotas 
    alter column estado type public.estado_cuota 
    using (
      case 
        when estado::text = 'pagada' then 'pagada'::public.estado_cuota
        when estado::text = 'parcial' then 'parcial'::public.estado_cuota
        when estado::text = 'condonada' then 'condonada'::public.estado_cuota
        else 'pendiente'::public.estado_cuota
      end
    );
  
  alter table if exists public.cuotas 
    alter column estado set default 'pendiente'::public.estado_cuota;
exception when others then
  -- Si la tabla no existe o ya tiene el tipo, continuar sin error
  null;
end $$;

-- 3. Limpiar el mecanismo anterior (si se aplicó) para evitar triggers duplicados
drop trigger if exists trg_pagos_sincroniza_cuota on public.pagos;
drop function if exists public.sincronizar_pago_cuota();

-- 4. Función única de sincronización cuotas/pagos (search_path seguro)
create or replace function public.recalcular_cuota()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  v_cuota  uuid := coalesce(new.cuota_id, old.cuota_id);
  v_total  numeric(10,2);
  v_monto  numeric(10,2);
begin
  select coalesce(sum(monto), 0) into v_total from public.pagos where cuota_id = v_cuota;
  select monto into v_monto from public.cuotas where id = v_cuota;
  update public.cuotas set
    monto_pagado = v_total,
    fecha_pago = case when v_total >= v_monto
      then (select max(fecha_pago) from public.pagos where cuota_id = v_cuota) else null end,
    estado = case when v_total >= v_monto then 'pagada'::public.estado_cuota
                  when v_total > 0        then 'parcial'::public.estado_cuota
                  else 'pendiente'::public.estado_cuota end
  where id = v_cuota and estado <> 'condonada';
  return null;
end; $$;

-- 5. Trigger en pagos (cubre insert, update y delete)
drop trigger if exists trg_pago_recalcula on public.pagos;
create trigger trg_pago_recalcula
after insert or delete or update on public.pagos
for each row execute function public.recalcular_cuota();