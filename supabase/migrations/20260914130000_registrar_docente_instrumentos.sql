drop function if exists public.registrar_docente(uuid, text, text, text, text, integer, boolean, boolean, uuid);

create or replace function public.registrar_docente(
  p_perfil_id uuid,
  p_slug text default null,
  p_titulo_profesional text default null,
  p_biografia text default null,
  p_frase_destacada text default null,
  p_anios_experiencia integer default null,
  p_publicado boolean default false,
  p_destacado boolean default false,
  p_instrumento_ids uuid[] default null,
  p_instrumento_principal_id uuid default null
)
returns uuid
language plpgsql
set search_path to ''
as $$
declare
  v_slug text;
  v_instrumentos uuid[];
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

  v_instrumentos := coalesce(p_instrumento_ids, '{}'::uuid[]);
  if p_instrumento_principal_id is not null
     and not (p_instrumento_principal_id = any (v_instrumentos)) then
    v_instrumentos := v_instrumentos || p_instrumento_principal_id;
  end if;

  insert into public.docentes (
    perfil_id, slug, titulo_profesional, biografia, frase_destacada,
    anios_experiencia, publicado, destacado
  ) values (
    p_perfil_id, v_slug::extensions.citext, nullif(trim(p_titulo_profesional), ''),
    nullif(trim(p_biografia), ''), nullif(trim(p_frase_destacada), ''),
    p_anios_experiencia, coalesce(p_publicado, false), coalesce(p_destacado, false)
  )
  on conflict (perfil_id) do nothing;

  insert into public.perfil_rol (perfil_id, rol, asignado_por)
  values (p_perfil_id, 'docente'::public.rol_usuario, auth.uid())
  on conflict (perfil_id, rol) do nothing;

  insert into public.docente_instrumento (docente_id, instrumento_id, es_principal)
  select p_perfil_id, instrumento_id, (instrumento_id = p_instrumento_principal_id)
  from unnest(v_instrumentos) as instrumento_id
  on conflict (docente_id, instrumento_id) do nothing;

  return p_perfil_id;
end;
$$;

create or replace function public.reemplazar_instrumentos_docente(
  p_docente_id uuid,
  p_instrumento_ids uuid[] default null,
  p_instrumento_principal_id uuid default null
)
returns void
language plpgsql
set search_path to ''
as $$
declare
  v_instrumentos uuid[];
begin
  if not public.es_admin() then
    raise exception 'Solo un administrador puede actualizar los instrumentos del docente';
  end if;

  v_instrumentos := coalesce(p_instrumento_ids, '{}'::uuid[]);
  if p_instrumento_principal_id is not null
     and not (p_instrumento_principal_id = any (v_instrumentos)) then
    v_instrumentos := v_instrumentos || p_instrumento_principal_id;
  end if;

  delete from public.docente_instrumento where docente_id = p_docente_id;

  insert into public.docente_instrumento (docente_id, instrumento_id, es_principal)
  select p_docente_id, instrumento_id, (instrumento_id = p_instrumento_principal_id)
  from unnest(v_instrumentos) as instrumento_id
  on conflict (docente_id, instrumento_id) do nothing;
end;
$$;
