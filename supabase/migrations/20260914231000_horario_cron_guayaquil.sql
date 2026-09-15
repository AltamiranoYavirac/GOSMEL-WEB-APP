-- pg_cron opera en UTC; 07:00 UTC equivale a 02:00 America/Guayaquil.
select cron.unschedule(jobid) from cron.job where jobname='gosmel-generar-cuotas-mensual';
select cron.schedule('gosmel-generar-cuotas-mensual','0 7 1 * *','select public.generar_cuotas_mes_cron()');
