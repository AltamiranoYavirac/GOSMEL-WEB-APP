revoke all on public.perfiles from anon;
grant select (id, nombres, apellidos, avatar_public_id) on public.perfiles to anon;

create policy "anon lee perfiles de docentes publicados"
  on public.perfiles for select to anon
  using (
    exists (
      select 1
      from public.docentes d
      where d.perfil_id = perfiles.id and d.publicado
    )
  );
