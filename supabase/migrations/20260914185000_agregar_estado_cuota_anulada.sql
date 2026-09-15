-- PostgreSQL requiere confirmar el valor de enum antes de usarlo en índices o constraints.
alter type public.estado_cuota add value if not exists 'anulada';
