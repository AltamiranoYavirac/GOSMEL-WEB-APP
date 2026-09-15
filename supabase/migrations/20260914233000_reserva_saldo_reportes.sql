create or replace function public.validar_reserva_cobro_aplicacion()
returns trigger language plpgsql security definer set search_path='' as $$
declare v_monto numeric; v_pagado numeric; v_reservado numeric; v_estado public.estado_cobro;
begin
 select c.estado into v_estado from public.cobros c where c.id=new.cobro_id;
 if v_estado<>'pendiente_verificacion' then return new; end if;
 select monto,monto_pagado into v_monto,v_pagado from public.cuotas where id=new.cuota_id for update;
 if not found then raise exception 'Cuota no encontrada'; end if;
 select coalesce(sum(a.monto),0) into v_reservado from public.cobro_aplicaciones a join public.cobros c on c.id=a.cobro_id where a.cuota_id=new.cuota_id and c.estado='pendiente_verificacion';
 if new.monto > v_monto-v_pagado-v_reservado then raise exception 'El monto supera el saldo disponible, considerando reportes pendientes'; end if;
 return new;
end $$;
drop trigger if exists trg_validar_reserva_cobro_aplicacion on public.cobro_aplicaciones;
create trigger trg_validar_reserva_cobro_aplicacion before insert or update on public.cobro_aplicaciones for each row execute function public.validar_reserva_cobro_aplicacion();

drop view if exists public.v_estado_cuenta cascade;
create view public.v_estado_cuenta with (security_invoker=on) as
select c.id cuota_id,c.estudiante_id,trim(e.nombres||' '||e.apellidos) estudiante,c.responsable_representante_id,c.acuerdo_id,c.tipo,c.concepto,c.origen,c.periodo_mes,c.monto,c.monto_pagado,
 coalesce((select sum(a.monto) from public.cobro_aplicaciones a join public.cobros co on co.id=a.cobro_id where a.cuota_id=c.id and co.estado='pendiente_verificacion'),0) saldo_reservado,
 case when c.estado in ('condonada','anulada') then 0 else greatest(c.monto-c.monto_pagado-coalesce((select sum(a.monto) from public.cobro_aplicaciones a join public.cobros co on co.id=a.cobro_id where a.cuota_id=c.id and co.estado='pendiente_verificacion'),0),0) end saldo,
 c.fecha_vencimiento,c.fecha_pago,c.estado,case when c.estado='condonada' then 'condonada' when c.estado='anulada' then 'anulada' when c.monto_pagado>=c.monto then 'pagada' when c.fecha_vencimiento<current_date then 'vencida' when c.monto_pagado>0 then 'parcial' else 'pendiente' end estado_efectivo,greatest(coalesce(current_date-c.fecha_vencimiento,0),0) dias_mora
from public.cuotas c join public.estudiantes e on e.id=c.estudiante_id;

create or replace view public.v_cobranza_responsables with (security_invoker=on) as
select coalesce(c.responsable_representante_id,c.estudiante_id) responsable_id,case when c.responsable_representante_id is null then 'estudiante' else 'representante' end responsable_tipo,coalesce(trim(r.nombres||' '||r.apellidos),trim(e_resp.nombres||' '||e_resp.apellidos)) responsable,coalesce(r.celular,e_resp.celular) celular,count(distinct c.estudiante_id) estudiantes_con_cargo,sum(ec.saldo) saldo_total,sum(ec.saldo) filter(where ec.periodo_mes=date_trunc('month',current_date)::date) saldo_mes,max(ec.dias_mora) filter(where ec.estado_efectivo='vencida') dias_mora_max
from public.v_estado_cuenta ec join public.cuotas c on c.id=ec.cuota_id left join public.representantes r on r.id=c.responsable_representante_id left join public.estudiantes e_resp on e_resp.id=c.estudiante_id and c.responsable_representante_id is null where ec.saldo>0 group by coalesce(c.responsable_representante_id,c.estudiante_id),case when c.responsable_representante_id is null then 'estudiante' else 'representante' end,r.nombres,r.apellidos,r.celular,e_resp.nombres,e_resp.apellidos,e_resp.celular;
