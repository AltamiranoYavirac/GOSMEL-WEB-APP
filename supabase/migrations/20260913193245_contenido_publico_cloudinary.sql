alter extension citext set schema extensions;

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public' and t.typname = 'categoria_curso'
  ) then
    create type public.categoria_curso as enum ('instrumento', 'lenguaje_musical', 'otro');
  end if;
end $$;

alter table public.cursos
  add column categoria public.categoria_curso,
  add column portada_texto_alt text,
  add column publico_edad text,
  add column publico_nivel text,
  add column formato_clase text,
  add column horario_resumen text,
  add column cierre_etapa text,
  add column cta_titulo text,
  add column cta_descripcion text,
  add column cta_primario_texto text,
  add column cta_secundario_texto text;

update public.cursos
set categoria = case
  when instrumento_id is null then 'lenguaje_musical'::public.categoria_curso
  else 'instrumento'::public.categoria_curso
end
where categoria is null;

update public.cursos
set portada_texto_alt = 'Portada del curso de ' || nombre
where portada_public_id is not null
  and nullif(btrim(portada_texto_alt), '') is null;

alter table public.cursos
  alter column categoria set default 'otro'::public.categoria_curso,
  alter column categoria set not null,
  add constraint cursos_portada_texto_alt_check check (
    portada_public_id is null or nullif(btrim(portada_texto_alt), '') is not null
  );

alter table public.programas
  add column imagen_texto_alt text,
  add constraint programas_imagen_texto_alt_check check (
    imagen_public_id is null or nullif(btrim(imagen_texto_alt), '') is not null
  );

alter table public.testimonios
  add column curso_id uuid,
  add constraint testimonios_curso_id_fkey
    foreign key (curso_id) references public.cursos(id) on delete set null;

create table public.activos_sitio (
  clave extensions.citext not null,
  nombre text not null,
  public_id text,
  texto_alt text,
  publicado boolean not null default true,
  orden integer not null default 0,
  actualizado_por uuid,
  updated_at timestamptz not null default now(),
  constraint activos_sitio_pkey primary key (clave),
  constraint activos_sitio_orden_check check (orden >= 0),
  constraint activos_sitio_texto_alt_check check (
    public_id is null or nullif(btrim(texto_alt), '') is not null
  ),
  constraint activos_sitio_actualizado_por_fkey
    foreign key (actualizado_por) references public.perfiles(id) on delete set null
);

insert into public.activos_sitio (clave, nombre, orden) values
  ('landing_hero_desktop', 'Landing · Hero escritorio', 10),
  ('landing_hero_mobile', 'Landing · Hero móvil', 20),
  ('landing_stage', 'Landing · Experiencia en escenario', 30),
  ('landing_teachers', 'Landing · Experiencia con docentes', 40),
  ('landing_process', 'Landing · Proceso de aprendizaje', 50),
  ('landing_cta', 'Landing · Llamado a la acción', 60),
  ('page_hero_courses', 'Cursos · Hero', 70),
  ('page_hero_about', 'Nosotros · Hero', 80),
  ('page_hero_contact', 'Contacto · Hero', 90),
  ('about_passion', 'Nosotros · Pasión', 100),
  ('about_discipline', 'Nosotros · Disciplina', 110),
  ('about_innovation', 'Nosotros · Innovación', 120),
  ('about_value_passion', 'Nosotros · Valor pasión', 130),
  ('about_value_discipline', 'Nosotros · Valor disciplina', 140),
  ('about_value_innovation', 'Nosotros · Valor innovación', 150),
  ('why_guitar', 'Nosotros · Guitarra', 160),
  ('why_piano', 'Nosotros · Piano', 170)
on conflict (clave) do nothing;

alter table public.catedras
  add constraint catedras_fechas_check check (
    fecha_fin is null or fecha_fin >= fecha_inicio
  );

alter table public.programa_curso
  add constraint programa_curso_orden_check check (orden >= 0);

alter table public.galeria_medios
  add constraint galeria_medios_orden_check check (orden >= 0);

create index if not exists idx_cursos_instrumento_id
  on public.cursos (instrumento_id);
create index if not exists idx_programas_instrumento_id
  on public.programas (instrumento_id);
create index if not exists idx_catedras_curso_id
  on public.catedras (curso_id);
create index if not exists idx_catedra_horarios_catedra_id
  on public.catedra_horarios (catedra_id);
create index if not exists idx_programa_curso_curso_id
  on public.programa_curso (curso_id);
create index if not exists idx_galeria_curso_orden
  on public.galeria_medios (curso_id, orden);
create index if not exists idx_testimonios_curso_orden
  on public.testimonios (curso_id, orden);
create index if not exists idx_activos_sitio_actualizado_por
  on public.activos_sitio (actualizado_por);

create trigger trg_activos_sitio_updated
before update on public.activos_sitio
for each row execute function public.set_updated_at();

alter table public.activos_sitio enable row level security;

grant select on public.activos_sitio to anon;
grant select, insert, update, delete on public.activos_sitio to authenticated;
grant all on public.activos_sitio to service_role;

create policy "admin gestiona activos del sitio"
  on public.activos_sitio for all to authenticated
  using ((select public.es_admin()))
  with check ((select public.es_admin()));

create policy "publico lee activos publicados"
  on public.activos_sitio for select to anon, authenticated
  using (publicado and public_id is not null);

create policy "cuenta activa requerida"
  on public.activos_sitio as restrictive for all to authenticated
  using ((select public.cuenta_activa()))
  with check ((select public.cuenta_activa()));

drop policy "publico lee catedras de cursos publicados" on public.catedras;
create policy "publico lee catedras disponibles"
  on public.catedras for select to anon, authenticated
  using (
    estado in ('planificada'::public.estado_catedra, 'en_curso'::public.estado_catedra)
    and exists (
      select 1 from public.cursos c
      where c.id = catedras.curso_id and c.publicado
    )
  );

drop policy "publico lee horarios" on public.catedra_horarios;
create policy "publico lee horarios disponibles"
  on public.catedra_horarios for select to anon, authenticated
  using (
    exists (
      select 1
      from public.catedras c
      join public.cursos cur on cur.id = c.curso_id
      where c.id = catedra_horarios.catedra_id
        and c.estado in ('planificada'::public.estado_catedra, 'en_curso'::public.estado_catedra)
        and cur.publicado
    )
  );

drop policy "publico lee vinculos de cursos publicados" on public.programa_curso;
create policy "publico lee vinculos publicados"
  on public.programa_curso for select to anon, authenticated
  using (
    exists (
      select 1 from public.programas p
      where p.id = programa_curso.programa_id and p.publicado
    )
    and exists (
      select 1 from public.cursos c
      where c.id = programa_curso.curso_id and c.publicado
    )
  );

drop policy "publico lee galeria publicada" on public.galeria_medios;
create policy "publico lee galeria publicada"
  on public.galeria_medios for select to anon, authenticated
  using (
    publicado
    and (
      curso_id is null
      or exists (
        select 1 from public.cursos c
        where c.id = galeria_medios.curso_id and c.publicado
      )
    )
  );

drop policy "publico lee testimonios publicados" on public.testimonios;
create policy "publico lee testimonios publicados"
  on public.testimonios for select to anon, authenticated
  using (
    publicado
    and (
      curso_id is null
      or exists (
        select 1 from public.cursos c
        where c.id = testimonios.curso_id and c.publicado
      )
    )
  );

drop policy "publico lee resenas publicadas" on public.curso_resenas;
create policy "anon lee resenas publicadas"
  on public.curso_resenas for select to anon
  using (publicado);
create policy "usuarios leen resenas permitidas"
  on public.curso_resenas for select to authenticated
  using (
    publicado
    or estudiante_id in (select public.estudiantes_accesibles())
  );

drop policy "acceso escalonado a materiales" on public.materiales;
create policy "anon lee materiales publicos"
  on public.materiales for select to anon
  using (visible_para = 'publico'::public.visibilidad_material);
create policy "usuarios leen materiales permitidos"
  on public.materiales for select to authenticated
  using (
    visible_para in (
      'publico'::public.visibilidad_material,
      'registrados'::public.visibilidad_material
    )
    or (
      visible_para = 'inscritos'::public.visibilidad_material
      and (select public.matriculado_en(catedra_id))
    )
    or (
      visible_para = 'docentes'::public.visibilidad_material
      and (select public.es_docente())
    )
    or (select public.es_admin())
  );

revoke execute on function public.cuenta_activa() from public, anon;
revoke execute on function public.roles_actuales() from public, anon;
revoke execute on function public.estudiantes_accesibles() from public, anon;
revoke execute on function public.matriculado_en(uuid) from public, anon;
revoke execute on function public.tiene_matricula_activa() from public, anon;
revoke execute on function public.solicitar_matricula(uuid, boolean, text, text, date, public.parentesco) from public, anon;

create or replace function public.crear_curso_con_catedra(
  p_curso jsonb,
  p_catedra jsonb default null
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_curso_id uuid;
  v_docente_id uuid;
begin
  if not public.es_admin() then
    raise exception 'Solo un administrador puede crear cursos';
  end if;

  insert into public.cursos (
    nombre,
    slug,
    resumen,
    descripcion,
    instrumento_id,
    categoria,
    nivel,
    modalidad,
    duracion_semanas,
    horas_totales,
    portada_public_id,
    portada_texto_alt,
    precio_referencial,
    etiqueta_precio,
    mostrar_precio,
    video_intro_url,
    publico_edad,
    publico_nivel,
    formato_clase,
    horario_resumen,
    cierre_etapa,
    cta_titulo,
    cta_descripcion,
    cta_primario_texto,
    cta_secundario_texto,
    publicado,
    destacado,
    orden
  ) values (
    p_curso ->> 'nombre',
    p_curso ->> 'slug',
    nullif(p_curso ->> 'resumen', ''),
    p_curso ->> 'descripcion',
    nullif(p_curso ->> 'instrumento_id', '')::uuid,
    coalesce((p_curso ->> 'categoria')::public.categoria_curso, 'otro'::public.categoria_curso),
    coalesce((p_curso ->> 'nivel')::public.nivel_curso, 'iniciacion'::public.nivel_curso),
    coalesce((p_curso ->> 'modalidad')::public.modalidad_curso, 'presencial'::public.modalidad_curso),
    nullif(p_curso ->> 'duracion_semanas', '')::integer,
    nullif(p_curso ->> 'horas_totales', '')::integer,
    nullif(p_curso ->> 'portada_public_id', ''),
    nullif(p_curso ->> 'portada_texto_alt', ''),
    nullif(p_curso ->> 'precio_referencial', '')::numeric,
    nullif(p_curso ->> 'etiqueta_precio', ''),
    coalesce((p_curso ->> 'mostrar_precio')::boolean, false),
    nullif(p_curso ->> 'video_intro_url', ''),
    nullif(p_curso ->> 'publico_edad', ''),
    nullif(p_curso ->> 'publico_nivel', ''),
    nullif(p_curso ->> 'formato_clase', ''),
    nullif(p_curso ->> 'horario_resumen', ''),
    nullif(p_curso ->> 'cierre_etapa', ''),
    nullif(p_curso ->> 'cta_titulo', ''),
    nullif(p_curso ->> 'cta_descripcion', ''),
    nullif(p_curso ->> 'cta_primario_texto', ''),
    nullif(p_curso ->> 'cta_secundario_texto', ''),
    coalesce((p_curso ->> 'publicado')::boolean, false),
    coalesce((p_curso ->> 'destacado')::boolean, false),
    coalesce((p_curso ->> 'orden')::integer, 0)
  )
  returning id into v_curso_id;

  if p_catedra is not null then
    v_docente_id := nullif(p_catedra ->> 'docente_id', '')::uuid;

    if v_docente_id is not null then
      insert into public.docentes (perfil_id, slug)
      select p.id, 'docente-' || replace(left(p.id::text, 8), '-', '')
      from public.perfiles p
      where p.id = v_docente_id
      on conflict (perfil_id) do nothing;

      insert into public.catedras (
        curso_id,
        docente_id,
        codigo,
        cupo_maximo,
        aula,
        modalidad,
        estado
      ) values (
        v_curso_id,
        v_docente_id,
        p_catedra ->> 'codigo',
        coalesce((p_catedra ->> 'cupo_maximo')::integer, 15),
        nullif(p_catedra ->> 'aula', ''),
        coalesce((p_catedra ->> 'modalidad')::public.modalidad_curso, 'presencial'::public.modalidad_curso),
        'planificada'::public.estado_catedra
      );
    end if;
  end if;

  return v_curso_id;
end;
$$;

create or replace function public.crear_catedra_con_horario(
  p_catedra jsonb,
  p_horario jsonb default null
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_catedra_id uuid;
  v_docente_id uuid := nullif(p_catedra ->> 'docente_id', '')::uuid;
begin
  if not public.es_admin() then
    raise exception 'Solo un administrador puede crear cátedras';
  end if;

  insert into public.docentes (perfil_id, slug)
  select p.id, 'docente-' || replace(left(p.id::text, 8), '-', '')
  from public.perfiles p
  where p.id = v_docente_id
  on conflict (perfil_id) do nothing;

  insert into public.catedras (
    curso_id,
    docente_id,
    codigo,
    cupo_maximo,
    aula,
    modalidad,
    fecha_inicio,
    fecha_fin,
    estado
  ) values (
    (p_catedra ->> 'curso_id')::uuid,
    v_docente_id,
    p_catedra ->> 'codigo',
    coalesce((p_catedra ->> 'cupo_maximo')::integer, 15),
    nullif(p_catedra ->> 'aula', ''),
    coalesce((p_catedra ->> 'modalidad')::public.modalidad_curso, 'presencial'::public.modalidad_curso),
    coalesce(nullif(p_catedra ->> 'fecha_inicio', '')::date, current_date),
    nullif(p_catedra ->> 'fecha_fin', '')::date,
    coalesce((p_catedra ->> 'estado')::public.estado_catedra, 'planificada'::public.estado_catedra)
  )
  returning id into v_catedra_id;

  if p_horario is not null then
    insert into public.catedra_horarios (
      catedra_id,
      dia_semana,
      hora_inicio,
      hora_fin
    ) values (
      v_catedra_id,
      (p_horario ->> 'dia_semana')::smallint,
      (p_horario ->> 'hora_inicio')::time,
      (p_horario ->> 'hora_fin')::time
    );
  end if;

  return v_catedra_id;
end;
$$;

revoke execute on function public.crear_curso_con_catedra(jsonb, jsonb) from public, anon;
revoke execute on function public.crear_catedra_con_horario(jsonb, jsonb) from public, anon;
grant execute on function public.crear_curso_con_catedra(jsonb, jsonb) to authenticated, service_role;
grant execute on function public.crear_catedra_con_horario(jsonb, jsonb) to authenticated, service_role;
