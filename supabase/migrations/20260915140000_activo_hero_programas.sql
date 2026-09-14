insert into public.activos_sitio (clave, nombre, orden) values
  ('page_hero_programs', 'Programas · Hero', 75)
on conflict (clave) do nothing;
