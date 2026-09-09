-- Las cuentas inactivas pueden consultar su perfil para mostrar el motivo del
-- bloqueo, pero no pueden editarlo. El service_role queda fuera de RLS.
create policy "cuenta activa requerida para actualizar perfil"
  on public.perfiles
  as restrictive
  for update
  to authenticated
  using (public.cuenta_activa())
  with check (public.cuenta_activa());

-- Esta comprobación vive en PostgreSQL para que dos desactivaciones
-- concurrentes nunca puedan dejar la academia sin un administrador activo.
create or replace function public.proteger_ultimo_admin_activo()
returns trigger
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
begin
  if old.activo and not new.activo and exists (
    select 1
      from public.perfil_rol pr
     where pr.perfil_id = old.id
       and pr.rol = 'admin'
  ) then
    perform pg_advisory_xact_lock(hashtextextended('gosmel:administradores-activos', 0));

    if (
      select count(*)
        from public.perfiles p
        join public.perfil_rol pr on pr.perfil_id = p.id
       where p.activo
         and pr.rol = 'admin'
    ) <= 1 then
      raise exception 'Debe existir al menos un administrador activo';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists validar_ultimo_administrador_activo on public.perfiles;

create trigger validar_ultimo_administrador_activo
  before update of activo on public.perfiles
  for each row
  execute function public.proteger_ultimo_admin_activo();
