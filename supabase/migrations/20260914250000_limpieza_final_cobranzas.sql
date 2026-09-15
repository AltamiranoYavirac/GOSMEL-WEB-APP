drop function if exists public.recalcular_cuota();
drop policy if exists "lectura de cuotas propias" on public.cuotas;
revoke all on table public.estudiante_representante from anon;
