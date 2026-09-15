create unique index if not exists cuotas_mensualidad_unica
  on public.cuotas using btree (acuerdo_id, periodo_mes)
  where tipo = 'mensualidad' and estado <> 'anulada';

alter table public.cuotas drop constraint if exists cuotas_acuerdo_id_periodo_mes_key;
