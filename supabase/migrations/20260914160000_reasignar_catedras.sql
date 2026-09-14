create or replace function public.reasignar_catedras(
  p_catedra_ids uuid[],
  p_docente_id uuid
)
returns integer
language plpgsql
set search_path to ''
as $$
declare
  v_incompatibles text;
  v_actualizadas integer;
begin
  if not public.es_admin() then
    raise exception 'Solo un administrador puede reasignar cátedras';
  end if;

  if p_docente_id is null then
    raise exception 'Selecciona un docente';
  end if;

  if coalesce(array_length(p_catedra_ids, 1), 0) = 0 then
    raise exception 'Selecciona al menos una cátedra';
  end if;

  if not exists (select 1 from public.docentes d where d.perfil_id = p_docente_id) then
    raise exception 'El docente indicado no existe';
  end if;

  select string_agg(c.codigo, ', ' order by c.codigo)
    into v_incompatibles
    from public.catedras c
    join public.cursos k on k.id = c.curso_id
   where c.id = any (p_catedra_ids)
     and k.instrumento_id is not null
     and not exists (
       select 1
         from public.docente_instrumento di
        where di.docente_id = p_docente_id
          and di.instrumento_id = k.instrumento_id
     );

  if v_incompatibles is not null then
    raise exception 'El docente no enseña el instrumento requerido por: %', v_incompatibles;
  end if;

  update public.catedras
     set docente_id = p_docente_id
   where id = any (p_catedra_ids);

  get diagnostics v_actualizadas = row_count;
  return v_actualizadas;
end;
$$;
