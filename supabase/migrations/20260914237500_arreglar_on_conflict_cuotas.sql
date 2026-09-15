-- Reproducible, idempotent definition of the unique mensualidad key used by
-- manual and cron generation. Staging already contains this index; keeping the
-- migration in source prevents schema drift on fresh environments.
create unique index if not exists cuotas_mensualidad_unica
  on public.cuotas(acuerdo_id, periodo_mes)
  where tipo = 'mensualidad' and estado <> 'anulada';
