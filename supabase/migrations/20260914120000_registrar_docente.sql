create or replace function public.registrar_docente(
  p_perfil_id uuid,
  p_slug text default null,
  p_titulo_profesional text default null,
  p_biografia text default null,
  p_frase_destacada text default null,
  p_anios_experiencia integer default null,
  p_publicado boolean default false,
  p_destacado boolean default false,
  p_instrumento_id uuid default null
)
returns uuid
language plpgsql
set search_path to ''
as $$
declare
  v_slug text;
begin
  if not public.es_admin() then
    raise exception 'Solo un administrador puede registrar docentes';
  end if;

  if not exists (select 1 from public.perfiles p where p.id = p_perfil_id) then
    raise exception 'El perfil indicado no existe';
  end if;

  v_slug := nullif(trim(p_slug), '');
  if v_slug is null then
    v_slug := 'docente-' || replace(left(p_perfil_id::text, 8), '-', '');
  end if;

  insert into public.docentes (
    perfil_id, slug, titulo_profesional, biografia, frase_destacada,
    anios_experiencia, publicado, destacado
  ) values (
    p_perfil_id, v_slug::extensions.citext, nullif(trim(p_titulo_profesional), ''),
    nullif(trim(p_biografia), ''), nullif(trim(p_frase_destacada), ''),
    coalesce(p_anios_experiencia, 0), coalesce(p_publicado, false), coalesce(p_destacado, false)
  )
  on conflict (perfil_id) do nothing;

  insert into public.perfil_rol (perfil_id, rol, asignado_por)
  values (p_perfil_id, 'docente'::public.rol_usuario, auth.uid())
  on conflict (perfil_id, rol) do nothing;

  if p_instrumento_id is not null then
    insert into public.docente_instrumento (docente_id, instrumento_id, es_principal)
    values (p_perfil_id, p_instrumento_id, true)
    on conflict (docente_id, instrumento_id) do nothing;
  end if;

  return p_perfil_id;
end;
$$;
