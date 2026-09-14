create extension if not exists pg_cron;

create or replace function public.generar_cuotas_mes_cron()
returns void language plpgsql security definer set search_path='' as $$
declare v_mes date:=date_trunc('month',current_date)::date; v_id uuid; v_creadas int;
begin
 insert into public.ejecuciones_generacion_cuotas(mes,origen,estado) values(v_mes,'cron','ejecutando') returning id into v_id;
 insert into public.cuotas(acuerdo_id,estudiante_id,responsable_representante_id,tipo,concepto,origen,periodo_mes,monto,fecha_vencimiento)
 select a.id,a.estudiante_id,a.responsable_representante_id,'mensualidad','Mensualidad','generacion_mensual',v_mes,c.monto_mensual,(v_mes+make_interval(days=>c.dia_cobro-1))::date
 from public.acuerdos_pago a join lateral(select * from public.acuerdo_condiciones x where x.acuerdo_id=a.id and x.vigente_desde<=v_mes order by x.vigente_desde desc limit 1)c on true
 where a.estado='vigente' and a.fecha_inicio<=v_mes and (a.fecha_fin is null or a.fecha_fin>=v_mes)
 on conflict(acuerdo_id,periodo_mes) where tipo='mensualidad' and estado<>'anulada' do nothing;
 get diagnostics v_creadas=row_count;
 update public.ejecuciones_generacion_cuotas set estado='completada',creadas=v_creadas,finished_at=now() where id=v_id;
exception when others then
 update public.ejecuciones_generacion_cuotas set estado='fallida',error=sqlerrm,finished_at=now() where id=v_id;
 raise;
end $$;

select cron.unschedule(jobid) from cron.job where jobname='gosmel-generar-cuotas-mensual';
select cron.schedule('gosmel-generar-cuotas-mensual','0 2 1 * *','select public.generar_cuotas_mes_cron()');
