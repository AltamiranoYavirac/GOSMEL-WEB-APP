alter table public.testimonios
  add column if not exists docente_id uuid references public.docentes(perfil_id) on delete set null;

create index if not exists testimonios_docente_id_idx on public.testimonios (docente_id);
