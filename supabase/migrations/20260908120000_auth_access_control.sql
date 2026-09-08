-- ============================================================================
-- Control de acceso inmediato para cuentas inactivas y roles actuales.
-- ============================================================================

create or replace function public.cuenta_activa()
returns boolean
language sql
stable
security definer
set search_path = public, pg_catalog
as $$
  select coalesce(
    (select p.activo from public.perfiles p where p.id = auth.uid()),
    false
  );
$$;

create or replace function public.roles_actuales()
returns text[]
language sql
stable
security definer
set search_path = public, pg_catalog
as $$
  select coalesce(
    (
      select array_agg(pr.rol::text order by pr.rol)
        from public.perfil_rol pr
       where pr.perfil_id = auth.uid()
         and public.cuenta_activa()
    ),
    array[]::text[]
  );
$$;

-- Un usuario puede editar sus datos de contacto, pero nunca puede reactivarse
-- ni cambiar campos de control administrativo mediante el cliente público.
revoke update on public.perfiles from authenticated;
grant update (nombres, apellidos, email, celular, cedula, avatar_public_id, rol_preferido)
  on public.perfiles to authenticated;

-- Todas las tablas protegidas exigen una cuenta activa para usuarios
-- autenticados. Las tablas públicas siguen siendo legibles por anon y la fila
-- propia de perfiles se conserva para poder mostrar el motivo de expulsión.
do $$
declare
  table_name text;
begin
  for table_name in
    select c.relname
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
     where n.nspname = 'public'
       and c.relkind in ('r', 'p')
       and c.relrowsecurity
       and c.relname <> 'perfiles'
  loop
    execute format(
      'create policy "cuenta activa requerida" on public.%I as restrictive for all to authenticated using (public.cuenta_activa()) with check (public.cuenta_activa())',
      table_name
    );
  end loop;
end;
$$;

grant execute on function public.cuenta_activa() to anon, authenticated, service_role;
grant execute on function public.roles_actuales() to anon, authenticated, service_role;
