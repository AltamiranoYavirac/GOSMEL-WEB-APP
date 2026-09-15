alter table public.secciones_institucionales
  add column if not exists imagen_texto_alt text;

alter table public.secciones_institucionales
  add constraint secciones_imagen_texto_alt_check check (
    imagen_public_id is null or nullif(btrim(imagen_texto_alt), '') is not null
  );

create or replace function public.editar_resena_propia(
  p_resena_id uuid,
  p_puntuacion smallint,
  p_comentario text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_estudiante uuid;
begin
  select estudiante_id into v_estudiante
  from public.curso_resenas
  where id = p_resena_id;

  if v_estudiante is null then
    raise exception 'La reseña no existe';
  end if;

  if v_estudiante not in (select public.estudiantes_accesibles()) then
    raise exception 'No puedes editar esta reseña';
  end if;

  if p_puntuacion is null or p_puntuacion < 1 or p_puntuacion > 5 then
    raise exception 'La puntuación debe estar entre 1 y 5';
  end if;

  update public.curso_resenas
  set puntuacion = p_puntuacion,
      comentario = nullif(btrim(coalesce(p_comentario, '')), ''),
      publicado = false
  where id = p_resena_id;
end;
$$;

create or replace function public.retirar_resena_propia(p_resena_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_estudiante uuid;
begin
  select estudiante_id into v_estudiante
  from public.curso_resenas
  where id = p_resena_id;

  if v_estudiante is null then
    return;
  end if;

  if v_estudiante not in (select public.estudiantes_accesibles()) then
    raise exception 'No puedes retirar esta reseña';
  end if;

  delete from public.curso_resenas where id = p_resena_id;
end;
$$;

revoke execute on function public.editar_resena_propia(uuid, smallint, text) from public, anon;
revoke execute on function public.retirar_resena_propia(uuid) from public, anon;
grant execute on function public.editar_resena_propia(uuid, smallint, text) to authenticated;
grant execute on function public.retirar_resena_propia(uuid) to authenticated;
