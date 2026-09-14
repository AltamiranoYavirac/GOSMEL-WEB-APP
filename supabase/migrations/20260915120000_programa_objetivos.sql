create table public.programa_objetivos (
  id uuid not null default gen_random_uuid(),
  programa_id uuid not null,
  objetivo text not null,
  orden integer not null default 0,
  constraint programa_objetivos_pkey primary key (id),
  constraint programa_objetivos_programa_id_fkey foreign key (programa_id) references public.programas(id) on delete cascade,
  constraint programa_objetivos_orden_check check (orden >= 0)
);

create index idx_objetivos_programa on public.programa_objetivos using btree (programa_id, orden);

alter table public.programa_objetivos enable row level security;

create policy "admin gestiona objetivos de programa" on public.programa_objetivos
  for all to authenticated
  using (public.es_admin())
  with check (public.es_admin());

create policy "cuenta activa requerida" on public.programa_objetivos
  as restrictive for all to authenticated
  using (public.cuenta_activa())
  with check (public.cuenta_activa());

create policy "publico lee objetivos de programas publicados" on public.programa_objetivos
  for select to anon, authenticated
  using (exists (select 1 from public.programas p where p.id = programa_objetivos.programa_id and p.publicado));

grant all on public.programa_objetivos to anon, authenticated, service_role;
