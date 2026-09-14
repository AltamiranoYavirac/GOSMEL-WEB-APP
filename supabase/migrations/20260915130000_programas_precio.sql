alter table public.programas
  add column precio_referencial numeric(10,2),
  add column etiqueta_precio text,
  add column mostrar_precio boolean not null default false,
  add constraint programas_precio_referencial_check check (precio_referencial >= 0::numeric);
