create trigger trg_configuracion_sitio_updated before update on public.configuracion_sitio
  for each row execute function public.set_updated_at();
