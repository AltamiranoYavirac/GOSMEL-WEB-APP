-- Protege el rol de administrador a nivel de base: no se puede retirar el rol
-- si dejaría a la academia sin administradores activos, ni quitárselo uno mismo.
-- Es el complemento de proteger_ultimo_admin_activo(), que cubre la desactivación.
create or replace function public.proteger_ultimo_admin()
returns trigger
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
begin
  if old.rol <> 'admin' then
    return old;
  end if;

  if old.perfil_id = auth.uid() then
    raise exception 'No puedes quitarte a ti mismo el rol de administrador';
  end if;

  perform pg_advisory_xact_lock(hashtextextended('gosmel:administradores-activos', 0));

  if not exists (
    select 1
      from public.perfiles p
      join public.perfil_rol pr on pr.perfil_id = p.id
     where p.activo
       and pr.rol = 'admin'
       and pr.perfil_id <> old.perfil_id
  ) then
    raise exception 'Debe existir al menos un administrador activo';
  end if;

  return old;
end;
$$;

drop trigger if exists validar_ultimo_administrador on public.perfil_rol;

create trigger validar_ultimo_administrador
  before delete on public.perfil_rol
  for each row
  execute function public.proteger_ultimo_admin();
