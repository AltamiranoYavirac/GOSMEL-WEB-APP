-- ============================================================================
-- 20260829000000_init_schema.sql
-- Esquema base de la base de datos GOSMEL Music Academy.
-- Squash generado desde el proyecto remoto dyndeppailmhdvzyiseb.
-- ============================================================================

-- Extensiones requeridas por el esquema public
create extension if not exists citext with schema public;

-- ============================================================================
-- 1. Enums
-- ============================================================================

create type public.categoria_medio as enum ('instalaciones', 'conciertos', 'aulas', 'general');
create type public.estado_acuerdo as enum ('vigente', 'suspendido', 'finalizado');
create type public.estado_asistencia as enum ('presente', 'ausente', 'justificado', 'atraso');
create type public.estado_catedra as enum ('planificada', 'en_curso', 'finalizada', 'cancelada');
create type public.estado_cuota as enum ('pendiente', 'parcial', 'pagada', 'condonada');
create type public.estado_inscripcion as enum ('pendiente', 'activa', 'finalizada', 'cancelada', 'retirada');
create type public.estado_sesion as enum ('programada', 'realizada', 'cancelada', 'reprogramada');
create type public.estado_solicitud as enum ('nueva', 'contactada', 'convertida', 'descartada');
create type public.modalidad_curso as enum ('presencial', 'virtual', 'hibrido');
create type public.nivel_curso as enum ('iniciacion', 'basico', 'intermedio', 'avanzado', 'maestria');
create type public.parentesco as enum ('madre', 'padre', 'abuelo', 'tio', 'hermano', 'tutor_legal', 'otro');
create type public.rol_usuario as enum ('estudiante', 'representante', 'docente', 'admin');
create type public.tipo_evaluacion as enum ('diagnostica', 'formativa', 'sumativa', 'recital', 'examen_practico', 'examen_teorico');
create type public.tipo_material as enum ('pdf', 'audio', 'video', 'partitura', 'enlace');
create type public.tipo_portafolio as enum ('imagen', 'video', 'audio');
create type public.tipo_solicitud as enum ('clase_prueba', 'admision', 'masterclass', 'contacto_general');
create type public.visibilidad_material as enum ('publico', 'registrados', 'inscritos', 'docentes');

-- ============================================================================
-- 2. Tablas
-- ============================================================================

create table public.tipos_instrumento (
  id uuid not null default gen_random_uuid(),
  nombre text not null,
  orden integer not null default 0,
  activo boolean not null default true,
  constraint tipos_instrumento_pkey primary key (id),
  constraint tipos_instrumento_nombre_key unique (nombre)
);

create table public.perfiles (
  id uuid not null,
  nombres text not null,
  apellidos text not null,
  email citext,
  celular text,
  cedula text,
  avatar_public_id text,
  rol_preferido public.rol_usuario,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint perfiles_pkey primary key (id),
  constraint perfiles_cedula_key unique (cedula),
  constraint perfiles_id_fkey foreign key (id) references auth.users(id) on delete cascade
);

create table public.instrumentos (
  id uuid not null default gen_random_uuid(),
  tipo_instrumento_id uuid not null,
  nombre text not null,
  slug citext not null,
  icono text,
  imagen_public_id text,
  orden integer not null default 0,
  activo boolean not null default true,
  constraint instrumentos_pkey primary key (id),
  constraint instrumentos_nombre_key unique (nombre),
  constraint instrumentos_slug_key unique (slug),
  constraint instrumentos_tipo_instrumento_id_fkey foreign key (tipo_instrumento_id) references public.tipos_instrumento(id) on delete restrict
);

create table public.cursos (
  id uuid not null default gen_random_uuid(),
  nombre text not null,
  slug citext not null,
  resumen text,
  descripcion text not null,
  instrumento_id uuid,
  nivel public.nivel_curso not null default 'iniciacion',
  modalidad public.modalidad_curso not null default 'presencial',
  duracion_semanas integer,
  horas_totales integer,
  portada_public_id text,
  video_intro_url text,
  precio_referencial numeric(10,2),
  etiqueta_precio text,
  mostrar_precio boolean not null default false,
  puntuacion_promedio numeric(2,1) not null default 0,
  total_resenas integer not null default 0,
  destacado boolean not null default false,
  publicado boolean not null default false,
  orden integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cursos_pkey primary key (id),
  constraint cursos_slug_key unique (slug),
  constraint cursos_duracion_semanas_check check (duracion_semanas > 0),
  constraint cursos_horas_totales_check check (horas_totales > 0),
  constraint cursos_precio_referencial_check check (precio_referencial >= 0::numeric),
  constraint cursos_puntuacion_promedio_check check (puntuacion_promedio >= 0::numeric and puntuacion_promedio <= 5::numeric),
  constraint cursos_instrumento_id_fkey foreign key (instrumento_id) references public.instrumentos(id) on delete set null
);

create table public.docentes (
  perfil_id uuid not null,
  slug citext not null,
  titulo_profesional text,
  biografia text,
  frase_destacada text,
  anios_experiencia integer,
  redes_sociales jsonb not null default '{}'::jsonb,
  publicado boolean not null default false,
  destacado boolean not null default false,
  orden integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint docentes_pkey primary key (perfil_id),
  constraint docentes_slug_key unique (slug),
  constraint docentes_anios_experiencia_check check (anios_experiencia >= 0),
  constraint docentes_perfil_id_fkey foreign key (perfil_id) references public.perfiles(id) on delete cascade
);

create table public.representantes (
  id uuid not null default gen_random_uuid(),
  perfil_id uuid,
  nombres text,
  apellidos text,
  celular text,
  email citext,
  cedula text,
  direccion text,
  ocupacion text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint representantes_pkey primary key (id),
  constraint representantes_cedula_key unique (cedula),
  constraint representantes_perfil_id_key unique (perfil_id),
  constraint chk_representante_identificable check (
    perfil_id is not null or (nombres is not null and apellidos is not null and celular is not null)
  ),
  constraint representantes_perfil_id_fkey foreign key (perfil_id) references public.perfiles(id) on delete set null
);

create table public.estudiantes (
  id uuid not null default gen_random_uuid(),
  perfil_id uuid,
  nombres text not null,
  apellidos text not null,
  cedula text,
  fecha_nacimiento date not null,
  celular text,
  email citext,
  avatar_public_id text,
  nivel_musical public.nivel_curso,
  fecha_ingreso date not null default CURRENT_DATE,
  biografia_corta text,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint estudiantes_pkey primary key (id),
  constraint estudiantes_cedula_key unique (cedula),
  constraint estudiantes_perfil_id_key unique (perfil_id),
  constraint estudiantes_perfil_id_fkey foreign key (perfil_id) references public.perfiles(id) on delete set null
);

create table public.docente_formacion (
  id uuid not null default gen_random_uuid(),
  docente_id uuid not null,
  institucion text not null,
  titulo text not null,
  anio_inicio integer,
  anio_fin integer,
  descripcion text,
  orden integer not null default 0,
  constraint docente_formacion_pkey primary key (id),
  constraint docente_formacion_check check (
    anio_fin is null or anio_inicio is null or anio_fin >= anio_inicio
  ),
  constraint docente_formacion_docente_id_fkey foreign key (docente_id) references public.docentes(perfil_id) on delete cascade
);

create table public.docente_instrumento (
  docente_id uuid not null,
  instrumento_id uuid not null,
  es_principal boolean not null default false,
  constraint docente_instrumento_pkey primary key (docente_id, instrumento_id),
  constraint docente_instrumento_docente_id_fkey foreign key (docente_id) references public.docentes(perfil_id) on delete cascade,
  constraint docente_instrumento_instrumento_id_fkey foreign key (instrumento_id) references public.instrumentos(id) on delete restrict
);

create table public.docente_portafolio (
  id uuid not null default gen_random_uuid(),
  docente_id uuid not null,
  tipo public.tipo_portafolio not null,
  public_id text,
  url_externa text,
  titulo text,
  orden integer not null default 0,
  publicado boolean not null default false,
  constraint docente_portafolio_pkey primary key (id),
  constraint docente_portafolio_check check (public_id is not null or url_externa is not null),
  constraint docente_portafolio_docente_id_fkey foreign key (docente_id) references public.docentes(perfil_id) on delete cascade
);

create table public.docente_reconocimientos (
  id uuid not null default gen_random_uuid(),
  docente_id uuid not null,
  titulo text not null,
  entidad_otorgante text,
  anio integer,
  descripcion text,
  orden integer not null default 0,
  constraint docente_reconocimientos_pkey primary key (id),
  constraint docente_reconocimientos_docente_id_fkey foreign key (docente_id) references public.docentes(perfil_id) on delete cascade
);

create table public.estudiante_instrumento (
  estudiante_id uuid not null,
  instrumento_id uuid not null,
  nivel public.nivel_curso,
  constraint estudiante_instrumento_pkey primary key (estudiante_id, instrumento_id),
  constraint estudiante_instrumento_estudiante_id_fkey foreign key (estudiante_id) references public.estudiantes(id) on delete cascade,
  constraint estudiante_instrumento_instrumento_id_fkey foreign key (instrumento_id) references public.instrumentos(id) on delete restrict
);

create table public.estudiante_representante (
  estudiante_id uuid not null,
  representante_id uuid not null,
  parentesco public.parentesco not null,
  es_contacto_principal boolean not null default false,
  autoriza_retiro boolean not null default true,
  constraint estudiante_representante_pkey primary key (estudiante_id, representante_id),
  constraint estudiante_representante_estudiante_id_fkey foreign key (estudiante_id) references public.estudiantes(id) on delete cascade,
  constraint estudiante_representante_representante_id_fkey foreign key (representante_id) references public.representantes(id) on delete restrict
);

create table public.perfil_rol (
  perfil_id uuid not null,
  rol public.rol_usuario not null,
  asignado_en timestamptz not null default now(),
  asignado_por uuid,
  constraint perfil_rol_pkey primary key (perfil_id, rol),
  constraint perfil_rol_perfil_id_fkey foreign key (perfil_id) references public.perfiles(id) on delete cascade,
  constraint perfil_rol_asignado_por_fkey foreign key (asignado_por) references public.perfiles(id) on delete set null
);

create table public.programas (
  id uuid not null default gen_random_uuid(),
  nombre text not null,
  slug citext not null,
  descripcion text,
  objetivos text,
  instrumento_id uuid,
  nivel public.nivel_curso,
  imagen_public_id text,
  publicado boolean not null default false,
  orden integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint programas_pkey primary key (id),
  constraint programas_slug_key unique (slug),
  constraint programas_instrumento_id_fkey foreign key (instrumento_id) references public.instrumentos(id) on delete set null
);

create table public.catedras (
  id uuid not null default gen_random_uuid(),
  curso_id uuid not null,
  docente_id uuid not null,
  codigo citext not null,
  cupo_maximo integer not null default 15,
  aula text,
  modalidad public.modalidad_curso not null default 'presencial',
  fecha_inicio date not null default CURRENT_DATE,
  fecha_fin date,
  estado public.estado_catedra not null default 'planificada',
  created_at timestamptz not null default now(),
  constraint catedras_pkey primary key (id),
  constraint catedras_codigo_key unique (codigo),
  constraint catedras_cupo_maximo_check check (cupo_maximo > 0),
  constraint catedras_curso_id_fkey foreign key (curso_id) references public.cursos(id) on delete restrict,
  constraint catedras_docente_id_fkey foreign key (docente_id) references public.docentes(perfil_id) on delete restrict
);

create table public.programa_curso (
  programa_id uuid not null,
  curso_id uuid not null,
  orden integer not null default 0,
  constraint programa_curso_pkey primary key (programa_id, curso_id),
  constraint programa_curso_programa_id_fkey foreign key (programa_id) references public.programas(id) on delete cascade,
  constraint programa_curso_curso_id_fkey foreign key (curso_id) references public.cursos(id) on delete cascade
);

create table public.catedra_horarios (
  id uuid not null default gen_random_uuid(),
  catedra_id uuid not null,
  dia_semana smallint not null,
  hora_inicio time without time zone not null,
  hora_fin time without time zone not null,
  constraint catedra_horarios_pkey primary key (id),
  constraint catedra_horarios_check check (hora_fin > hora_inicio),
  constraint catedra_horarios_dia_semana_check check (dia_semana >= 0 and dia_semana <= 6),
  constraint catedra_horarios_catedra_id_fkey foreign key (catedra_id) references public.catedras(id) on delete cascade
);

create table public.inscripciones (
  id uuid not null default gen_random_uuid(),
  estudiante_id uuid not null,
  catedra_id uuid not null,
  fecha_inscripcion timestamptz not null default now(),
  fecha_inicio date not null default CURRENT_DATE,
  fecha_fin date,
  estado public.estado_inscripcion not null default 'pendiente',
  progreso_pct numeric(5,2) not null default 0,
  solicitada_por uuid,
  aprobada_por uuid,
  aprobada_en timestamptz,
  motivo_rechazo text,
  constraint inscripciones_pkey primary key (id),
  constraint inscripciones_estudiante_id_catedra_id_key unique (estudiante_id, catedra_id),
  constraint inscripciones_progreso_pct_check check (progreso_pct >= 0::numeric and progreso_pct <= 100::numeric),
  constraint inscripciones_estudiante_id_fkey foreign key (estudiante_id) references public.estudiantes(id) on delete cascade,
  constraint inscripciones_catedra_id_fkey foreign key (catedra_id) references public.catedras(id) on delete restrict,
  constraint inscripciones_solicitada_por_fkey foreign key (solicitada_por) references public.perfiles(id) on delete set null,
  constraint inscripciones_aprobada_por_fkey foreign key (aprobada_por) references public.perfiles(id) on delete set null
);

create table public.sesiones (
  id uuid not null default gen_random_uuid(),
  catedra_id uuid not null,
  fecha date not null,
  hora_inicio time without time zone not null,
  hora_fin time without time zone not null,
  tema text,
  estado public.estado_sesion not null default 'programada',
  constraint sesiones_pkey primary key (id),
  constraint sesiones_catedra_id_fecha_hora_inicio_key unique (catedra_id, fecha, hora_inicio),
  constraint sesiones_catedra_id_fkey foreign key (catedra_id) references public.catedras(id) on delete cascade
);

create table public.asistencias (
  inscripcion_id uuid not null,
  sesion_id uuid not null,
  estado public.estado_asistencia not null default 'presente',
  observacion text,
  registrada_en timestamptz not null default now(),
  constraint asistencias_pkey primary key (inscripcion_id, sesion_id),
  constraint asistencias_inscripcion_id_fkey foreign key (inscripcion_id) references public.inscripciones(id) on delete cascade,
  constraint asistencias_sesion_id_fkey foreign key (sesion_id) references public.sesiones(id) on delete cascade
);

create table public.evaluaciones (
  id uuid not null default gen_random_uuid(),
  catedra_id uuid not null,
  sesion_id uuid,
  titulo text not null,
  tipo public.tipo_evaluacion not null default 'formativa',
  descripcion text,
  fecha date,
  nota_maxima numeric(4,2) not null default 10,
  ponderacion numeric(5,2) not null default 0,
  creada_por uuid,
  created_at timestamptz not null default now(),
  constraint evaluaciones_pkey primary key (id),
  constraint evaluaciones_nota_maxima_check check (nota_maxima > 0::numeric),
  constraint evaluaciones_ponderacion_check check (ponderacion >= 0::numeric and ponderacion <= 100::numeric),
  constraint evaluaciones_catedra_id_fkey foreign key (catedra_id) references public.catedras(id) on delete cascade,
  constraint evaluaciones_sesion_id_fkey foreign key (sesion_id) references public.sesiones(id) on delete set null,
  constraint evaluaciones_creada_por_fkey foreign key (creada_por) references public.perfiles(id) on delete set null
);

create table public.calificaciones (
  evaluacion_id uuid not null,
  inscripcion_id uuid not null,
  nota numeric(4,2),
  observacion text,
  calificada_por uuid,
  calificada_en timestamptz not null default now(),
  constraint calificaciones_pkey primary key (evaluacion_id, inscripcion_id),
  constraint calificaciones_nota_check check (nota >= 0::numeric),
  constraint calificaciones_evaluacion_id_fkey foreign key (evaluacion_id) references public.evaluaciones(id) on delete cascade,
  constraint calificaciones_inscripcion_id_fkey foreign key (inscripcion_id) references public.inscripciones(id) on delete cascade,
  constraint calificaciones_calificada_por_fkey foreign key (calificada_por) references public.perfiles(id) on delete set null
);

create table public.materiales (
  id uuid not null default gen_random_uuid(),
  catedra_id uuid,
  curso_id uuid,
  titulo text not null,
  tipo public.tipo_material not null,
  storage_path text,
  url_externa text,
  visible_para public.visibilidad_material not null default 'inscritos',
  subido_por uuid,
  created_at timestamptz not null default now(),
  constraint materiales_pkey primary key (id),
  constraint materiales_check check (catedra_id is not null or curso_id is not null),
  constraint materiales_check1 check (storage_path is not null or url_externa is not null),
  constraint materiales_catedra_id_fkey foreign key (catedra_id) references public.catedras(id) on delete cascade,
  constraint materiales_curso_id_fkey foreign key (curso_id) references public.cursos(id) on delete cascade,
  constraint materiales_subido_por_fkey foreign key (subido_por) references public.perfiles(id) on delete set null
);

create table public.acuerdos_pago (
  id uuid not null default gen_random_uuid(),
  estudiante_id uuid not null,
  inscripcion_id uuid,
  monto_mensual numeric(10,2) not null,
  moneda character(3) not null default 'USD'::bpchar,
  dia_cobro smallint,
  fecha_inicio date not null default CURRENT_DATE,
  fecha_fin date,
  motivo_ajuste text,
  observaciones text,
  estado public.estado_acuerdo not null default 'vigente',
  acordado_por uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint acuerdos_pago_pkey primary key (id),
  constraint acuerdos_pago_check check (fecha_fin is null or fecha_fin >= fecha_inicio),
  constraint acuerdos_pago_dia_cobro_check check (dia_cobro >= 1 and dia_cobro <= 28),
  constraint acuerdos_pago_monto_mensual_check check (monto_mensual >= 0::numeric),
  constraint acuerdos_pago_estudiante_id_fkey foreign key (estudiante_id) references public.estudiantes(id) on delete cascade,
  constraint acuerdos_pago_inscripcion_id_fkey foreign key (inscripcion_id) references public.inscripciones(id) on delete set null,
  constraint acuerdos_pago_acordado_por_fkey foreign key (acordado_por) references public.perfiles(id) on delete set null
);

create table public.cuotas (
  id uuid not null default gen_random_uuid(),
  acuerdo_id uuid not null,
  periodo_mes date not null,
  monto numeric(10,2) not null,
  monto_pagado numeric(10,2) not null default 0,
  estado public.estado_cuota not null default 'pendiente',
  fecha_vencimiento date,
  fecha_pago date,
  created_at timestamptz not null default now(),
  constraint cuotas_pkey primary key (id),
  constraint cuotas_acuerdo_id_periodo_mes_key unique (acuerdo_id, periodo_mes),
  constraint cuotas_monto_check check (monto >= 0::numeric),
  constraint cuotas_monto_pagado_check check (monto_pagado >= 0::numeric),
  constraint cuotas_acuerdo_id_fkey foreign key (acuerdo_id) references public.acuerdos_pago(id) on delete cascade
);

create table public.pagos (
  id uuid not null default gen_random_uuid(),
  cuota_id uuid not null,
  monto numeric(10,2) not null,
  fecha_pago date not null default CURRENT_DATE,
  metodo text,
  referencia text,
  comprobante_storage_path text,
  registrado_por uuid,
  observacion text,
  created_at timestamptz not null default now(),
  constraint pagos_pkey primary key (id),
  constraint pagos_monto_check check (monto > 0::numeric),
  constraint pagos_cuota_id_fkey foreign key (cuota_id) references public.cuotas(id) on delete restrict,
  constraint pagos_registrado_por_fkey foreign key (registrado_por) references public.perfiles(id) on delete set null
);

create table public.certificados (
  id uuid not null default gen_random_uuid(),
  inscripcion_id uuid not null,
  codigo_verificacion citext not null,
  fecha_emision date not null default CURRENT_DATE,
  storage_path text,
  constraint certificados_pkey primary key (id),
  constraint certificados_codigo_verificacion_key unique (codigo_verificacion),
  constraint certificados_inscripcion_id_key unique (inscripcion_id),
  constraint certificados_inscripcion_id_fkey foreign key (inscripcion_id) references public.inscripciones(id) on delete cascade
);

create table public.curso_modulos (
  id uuid not null default gen_random_uuid(),
  curso_id uuid not null,
  titulo text not null,
  descripcion text,
  orden integer not null default 0,
  constraint curso_modulos_pkey primary key (id),
  constraint curso_modulos_curso_id_fkey foreign key (curso_id) references public.cursos(id) on delete cascade
);

create table public.curso_lecciones (
  id uuid not null default gen_random_uuid(),
  modulo_id uuid not null,
  titulo text not null,
  descripcion text,
  duracion_minutos integer,
  es_muestra boolean not null default false,
  orden integer not null default 0,
  constraint curso_lecciones_pkey primary key (id),
  constraint curso_lecciones_modulo_id_fkey foreign key (modulo_id) references public.curso_modulos(id) on delete cascade
);

create table public.curso_habilidades (
  id uuid not null default gen_random_uuid(),
  curso_id uuid not null,
  habilidad text not null,
  orden integer not null default 0,
  constraint curso_habilidades_pkey primary key (id),
  constraint curso_habilidades_curso_id_fkey foreign key (curso_id) references public.cursos(id) on delete cascade
);

create table public.curso_resenas (
  id uuid not null default gen_random_uuid(),
  curso_id uuid not null,
  estudiante_id uuid not null,
  puntuacion smallint not null,
  comentario text,
  publicado boolean not null default false,
  created_at timestamptz not null default now(),
  constraint curso_resenas_pkey primary key (id),
  constraint curso_resenas_curso_id_estudiante_id_key unique (curso_id, estudiante_id),
  constraint curso_resenas_puntuacion_check check (puntuacion >= 1 and puntuacion <= 5),
  constraint curso_resenas_curso_id_fkey foreign key (curso_id) references public.cursos(id) on delete cascade,
  constraint curso_resenas_estudiante_id_fkey foreign key (estudiante_id) references public.estudiantes(id) on delete cascade
);

create table public.progreso_lecciones (
  inscripcion_id uuid not null,
  leccion_id uuid not null,
  completada boolean not null default false,
  completada_en timestamptz,
  constraint progreso_lecciones_pkey primary key (inscripcion_id, leccion_id),
  constraint progreso_lecciones_inscripcion_id_fkey foreign key (inscripcion_id) references public.inscripciones(id) on delete cascade,
  constraint progreso_lecciones_leccion_id_fkey foreign key (leccion_id) references public.curso_lecciones(id) on delete cascade
);

create table public.registros_practica (
  id uuid not null default gen_random_uuid(),
  estudiante_id uuid not null,
  inscripcion_id uuid,
  fecha date not null default CURRENT_DATE,
  minutos integer not null,
  nota text,
  constraint registros_practica_pkey primary key (id),
  constraint registros_practica_minutos_check check (minutos > 0),
  constraint registros_practica_estudiante_id_fkey foreign key (estudiante_id) references public.estudiantes(id) on delete cascade,
  constraint registros_practica_inscripcion_id_fkey foreign key (inscripcion_id) references public.inscripciones(id) on delete set null
);

create table public.favoritos (
  perfil_id uuid not null,
  curso_id uuid not null,
  created_at timestamptz not null default now(),
  constraint favoritos_pkey primary key (perfil_id, curso_id),
  constraint favoritos_perfil_id_fkey foreign key (perfil_id) references public.perfiles(id) on delete cascade,
  constraint favoritos_curso_id_fkey foreign key (curso_id) references public.cursos(id) on delete cascade
);

create table public.solicitudes (
  id uuid not null default gen_random_uuid(),
  tipo public.tipo_solicitud not null,
  nombre_completo text,
  email citext not null,
  telefono text,
  instrumento_id uuid,
  curso_id uuid,
  docente_id uuid,
  mensaje text,
  para_menor boolean not null default false,
  estudiante_nombre text,
  estudiante_fecha_nacimiento date,
  parentesco public.parentesco,
  consentimiento_datos boolean not null,
  consentimiento_otorgado_por text not null default 'titular'::text,
  consentimiento_en timestamptz not null default now(),
  estado public.estado_solicitud not null default 'nueva',
  origen_url text,
  notas_internas text,
  atendida_por uuid,
  created_at timestamptz not null default now(),
  constraint solicitudes_pkey primary key (id),
  constraint chk_consentimiento_lopdp check (consentimiento_datos = true),
  constraint chk_datos_menor check (
    not para_menor or (
      estudiante_nombre is not null and estudiante_fecha_nacimiento is not null
      and parentesco is not null and consentimiento_otorgado_por = 'representante'::text
    )
  ),
  constraint chk_nombre_admision check (tipo <> 'admision'::public.tipo_solicitud or nombre_completo is not null),
  constraint solicitudes_consentimiento_otorgado_por_check check (
    consentimiento_otorgado_por = any (array['titular'::text, 'representante'::text])
  ),
  constraint solicitudes_atendida_por_fkey foreign key (atendida_por) references public.perfiles(id) on delete set null,
  constraint solicitudes_curso_id_fkey foreign key (curso_id) references public.cursos(id) on delete set null,
  constraint solicitudes_docente_id_fkey foreign key (docente_id) references public.docentes(perfil_id) on delete set null,
  constraint solicitudes_instrumento_id_fkey foreign key (instrumento_id) references public.instrumentos(id) on delete set null
);

create table public.configuracion_sitio (
  id smallint not null default 1,
  direccion text,
  ciudad text,
  telefono text,
  whatsapp text,
  email_general citext,
  email_admisiones citext,
  horario_atencion text,
  redes_sociales jsonb not null default '{}'::jsonb,
  mapa_embed text,
  actualizado_por uuid,
  updated_at timestamptz not null default now(),
  constraint configuracion_sitio_pkey primary key (id),
  constraint configuracion_sitio_id_check check (id = 1),
  constraint configuracion_sitio_actualizado_por_fkey foreign key (actualizado_por) references public.perfiles(id) on delete set null
);

create table public.metricas_academia (
  id uuid not null default gen_random_uuid(),
  etiqueta text not null,
  valor text not null,
  sufijo text,
  icono text,
  orden integer not null default 0,
  publicado boolean not null default true,
  actualizado_por uuid,
  updated_at timestamptz not null default now(),
  constraint metricas_academia_pkey primary key (id),
  constraint metricas_academia_actualizado_por_fkey foreign key (actualizado_por) references public.perfiles(id) on delete set null
);

create table public.secciones_institucionales (
  id uuid not null default gen_random_uuid(),
  clave citext not null,
  titulo text not null,
  contenido text not null,
  imagen_public_id text,
  orden integer not null default 0,
  publicado boolean not null default true,
  actualizado_por uuid,
  updated_at timestamptz not null default now(),
  constraint secciones_institucionales_pkey primary key (id),
  constraint secciones_institucionales_clave_key unique (clave),
  constraint secciones_institucionales_actualizado_por_fkey foreign key (actualizado_por) references public.perfiles(id) on delete set null
);

create table public.galeria_medios (
  id uuid not null default gen_random_uuid(),
  categoria public.categoria_medio not null default 'general',
  curso_id uuid,
  public_id text not null,
  titulo text,
  texto_alt text not null,
  orden integer not null default 0,
  publicado boolean not null default false,
  actualizado_por uuid,
  updated_at timestamptz not null default now(),
  constraint galeria_medios_pkey primary key (id),
  constraint galeria_medios_actualizado_por_fkey foreign key (actualizado_por) references public.perfiles(id) on delete set null,
  constraint galeria_medios_curso_id_fkey foreign key (curso_id) references public.cursos(id) on delete cascade
);

create table public.testimonios (
  id uuid not null default gen_random_uuid(),
  autor_nombre text not null,
  autor_rol text,
  foto_public_id text,
  cita text not null,
  puntuacion smallint,
  estudiante_id uuid,
  publicado boolean not null default false,
  orden integer not null default 0,
  actualizado_por uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint testimonios_pkey primary key (id),
  constraint testimonios_puntuacion_check check (puntuacion >= 1 and puntuacion <= 5),
  constraint testimonios_actualizado_por_fkey foreign key (actualizado_por) references public.perfiles(id) on delete set null,
  constraint testimonios_estudiante_id_fkey foreign key (estudiante_id) references public.estudiantes(id) on delete set null
);

create table public.actividades (
  id uuid not null default gen_random_uuid(),
  perfil_id uuid,
  estudiante_id uuid,
  tipo text not null,
  titulo text not null,
  descripcion text,
  entidad_tipo text,
  entidad_id uuid,
  created_at timestamptz not null default now(),
  constraint actividades_pkey primary key (id),
  constraint actividades_perfil_id_fkey foreign key (perfil_id) references public.perfiles(id) on delete cascade,
  constraint actividades_estudiante_id_fkey foreign key (estudiante_id) references public.estudiantes(id) on delete cascade
);

-- ============================================================================
-- 3. Índices
-- ============================================================================

create index idx_actividades_estudiante on public.actividades using btree (estudiante_id, created_at desc);
create unique index idx_acuerdo_vigente on public.acuerdos_pago using btree (estudiante_id, inscripcion_id) nulls not distinct where (estado = 'vigente'::public.estado_acuerdo);
create index idx_catedras_docente on public.catedras using btree (docente_id, estado);
create index idx_habilidades_curso on public.curso_habilidades using btree (curso_id, orden);
create index idx_lecciones_modulo on public.curso_lecciones using btree (modulo_id, orden);
create index idx_modulos_curso on public.curso_modulos using btree (curso_id, orden);
create index idx_resenas_curso on public.curso_resenas using btree (curso_id) where publicado;
create index idx_cursos_busqueda on public.cursos using gin (to_tsvector('spanish'::regconfig, ((nombre || ' '::text) || coalesce(resumen, ''::text))));
create index idx_cursos_destacados on public.cursos using btree (destacado) where (publicado and destacado);
create index idx_cursos_publicos on public.cursos using btree (publicado, orden) where publicado;
create index idx_formacion_docente on public.docente_formacion using btree (docente_id, orden);
create index idx_portafolio_docente on public.docente_portafolio using btree (docente_id, orden);
create index idx_reconocimientos_docente on public.docente_reconocimientos using btree (docente_id, orden);
create index idx_docentes_publicados on public.docentes using btree (publicado, orden) where publicado;
create unique index idx_contacto_principal_unico on public.estudiante_representante using btree (estudiante_id) where es_contacto_principal;
create index idx_estudiantes_perfil on public.estudiantes using btree (perfil_id);
create index idx_evaluaciones_catedra on public.evaluaciones using btree (catedra_id, fecha);
create index idx_galeria_categoria on public.galeria_medios using btree (categoria, orden) where publicado;
create index idx_inscripciones_pendientes on public.inscripciones using btree (estado, fecha_inscripcion) where (estado = 'pendiente'::public.estado_inscripcion);
create index idx_instrumentos_tipo on public.instrumentos using btree (tipo_instrumento_id) where activo;
create index idx_pagos_cuota on public.pagos using btree (cuota_id);
create index idx_perfil_rol_rol on public.perfil_rol using btree (rol);
create index idx_representantes_sin_cuenta on public.representantes using btree (apellidos, nombres) where (perfil_id is null);
create index idx_sesiones_proximas on public.sesiones using btree (fecha, hora_inicio) where (estado = 'programada'::public.estado_sesion);
create index idx_solicitudes_estado on public.solicitudes using btree (estado, created_at desc);

-- ============================================================================
-- 4. Funciones
-- ============================================================================

create or replace function public.set_updated_at()
returns trigger language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create or replace function public.roles_actuales()
returns text[] language sql stable set search_path = public, pg_catalog
as $$
  select coalesce((select array_agg(x)
    from jsonb_array_elements_text(auth.jwt() -> 'user_roles') t(x)), array[]::text[]);
$$;

create or replace function public.tiene_rol(p text)
returns boolean language sql stable set search_path = public, pg_catalog
as $$
  select p = any(public.roles_actuales());
$$;

create or replace function public.es_admin()
returns boolean language sql stable set search_path = public, pg_catalog
as $$
  select public.tiene_rol('admin');
$$;

create or replace function public.es_docente()
returns boolean language sql stable set search_path = public, pg_catalog
as $$
  select public.tiene_rol('docente') or public.tiene_rol('admin');
$$;

create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare
  claims jsonb;
  v_roles text[];
begin
  select coalesce(array_agg(rol::text order by rol), array[]::text[])
    into v_roles
    from public.perfil_rol
   where perfil_id = (event ->> 'user_id')::uuid;

  claims := jsonb_set(event -> 'claims', '{user_roles}', to_jsonb(v_roles));
  return jsonb_build_object('claims', claims);
end;
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.perfiles (id, nombres, apellidos, email, celular)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'nombres',
      new.raw_user_meta_data ->> 'given_name',
      new.raw_user_meta_data ->> 'name',
      new.raw_user_meta_data ->> 'full_name',
      ''
    ),
    coalesce(
      new.raw_user_meta_data ->> 'apellidos',
      new.raw_user_meta_data ->> 'family_name',
      ''
    ),
    new.email,
    new.raw_user_meta_data ->> 'celular'
  );
  return new;
end;
$$;

create or replace function public.sync_email_perfil()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  update public.perfiles set email = new.email where id = new.id;
  return new;
end;
$$;

create or replace function public.estudiantes_accesibles()
returns setof uuid language sql stable security definer set search_path = ''
as $$
  select e.id from public.estudiantes e where e.perfil_id = auth.uid()
  union
  select er.estudiante_id
    from public.estudiante_representante er
    join public.representantes r on r.id = er.representante_id
   where r.perfil_id = auth.uid();
$$;

create or replace function public.matriculado_en(p_catedra uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.inscripciones i
    where i.catedra_id = p_catedra and i.estado = 'activa'
      and i.estudiante_id in (select public.estudiantes_accesibles()));
$$;

create or replace function public.tiene_matricula_activa()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.inscripciones i
    where i.estudiante_id in (select public.estudiantes_accesibles())
      and i.estado = 'activa');
$$;

create or replace function public.controlar_cupo()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare
  v_ocupados int;
  v_max int;
begin
  if new.estado <> 'activa' then return new; end if;
  select count(*) into v_ocupados from public.inscripciones
   where catedra_id = new.catedra_id and estado = 'activa' and id <> new.id;
  select cupo_maximo into v_max from public.catedras where id = new.catedra_id;
  if v_ocupados >= v_max then
    raise exception 'La catedra alcanzo su cupo maximo (%)', v_max;
  end if;
  return new;
end;
$$;

create or replace function public.impedir_autoinscripcion()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  if exists (select 1 from public.catedras c
              join public.estudiantes e on e.id = new.estudiante_id
             where c.id = new.catedra_id and c.docente_id = e.perfil_id) then
    raise exception 'Un docente no puede inscribirse en su propia catedra';
  end if;
  return new;
end;
$$;

create or replace function public.exigir_representante_menor()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare
  v_menor boolean;
begin
  select (fecha_nacimiento > current_date - interval '18 years')
    into v_menor from public.estudiantes where id = new.estudiante_id;
  if v_menor and not exists (select 1 from public.estudiante_representante
                              where estudiante_id = new.estudiante_id) then
    raise exception 'Un estudiante menor de edad requiere al menos un representante';
  end if;
  return new;
end;
$$;

create or replace function public.recalcular_cuota()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare
  v_cuota uuid := coalesce(new.cuota_id, old.cuota_id);
  v_total numeric(10,2);
  v_monto numeric(10,2);
begin
  select coalesce(sum(monto), 0) into v_total from public.pagos where cuota_id = v_cuota;
  select monto into v_monto from public.cuotas where id = v_cuota;
  update public.cuotas set
    monto_pagado = v_total,
    fecha_pago = case when v_total >= v_monto
      then (select max(fecha_pago) from public.pagos where cuota_id = v_cuota) else null end,
    estado = case when v_total >= v_monto then 'pagada'::public.estado_cuota
                  when v_total > 0        then 'parcial'::public.estado_cuota
                  else 'pendiente'::public.estado_cuota end
  where id = v_cuota and estado <> 'condonada';
  return null;
end;
$$;

create or replace function public.recalcular_puntuacion_curso()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare
  v_curso uuid := coalesce(new.curso_id, old.curso_id);
begin
  update public.cursos set
    puntuacion_promedio = coalesce((select round(avg(puntuacion)::numeric, 1)
      from public.curso_resenas where curso_id = v_curso and publicado), 0),
    total_resenas = (select count(*) from public.curso_resenas
      where curso_id = v_curso and publicado)
  where id = v_curso;
  return null;
end;
$$;

create or replace function public.aprobar_matricula(
  p_inscripcion_id uuid,
  p_monto_mensual numeric,
  p_dia_cobro smallint default 5,
  p_motivo_ajuste text default null
) returns void language plpgsql security definer set search_path = ''
as $$
declare
  v_estudiante uuid;
begin
  if not public.es_admin() then raise exception 'Solo un administrador puede aprobar'; end if;

  update public.inscripciones
     set estado = 'activa', aprobada_por = auth.uid(), aprobada_en = now()
   where id = p_inscripcion_id and estado = 'pendiente'
   returning estudiante_id into v_estudiante;

  if v_estudiante is null then raise exception 'Inscripcion no encontrada o ya procesada'; end if;

  insert into public.acuerdos_pago
    (estudiante_id, inscripcion_id, monto_mensual, dia_cobro, motivo_ajuste, acordado_por)
  values (v_estudiante, p_inscripcion_id, p_monto_mensual, p_dia_cobro, p_motivo_ajuste, auth.uid());
end;
$$;

create or replace function public.generar_cuotas_mes(p_mes date)
returns integer language plpgsql security definer set search_path = ''
as $$
declare
  v_creadas int;
begin
  if not public.es_admin() then raise exception 'Solo un administrador'; end if;
  insert into public.cuotas (acuerdo_id, periodo_mes, monto, fecha_vencimiento)
  select a.id, date_trunc('month', p_mes)::date, a.monto_mensual,
         (date_trunc('month', p_mes) + make_interval(days => coalesce(a.dia_cobro, 5) - 1))::date
    from public.acuerdos_pago a
   where a.estado = 'vigente'
     and a.fecha_inicio <= (date_trunc('month', p_mes) + interval '1 month - 1 day')::date
     and (a.fecha_fin is null or a.fecha_fin >= date_trunc('month', p_mes)::date)
  on conflict (acuerdo_id, periodo_mes) do nothing;
  get diagnostics v_creadas = row_count;
  return v_creadas;
end;
$$;

create or replace function public.solicitar_matricula(
  p_catedra_id uuid,
  p_para_menor boolean,
  p_nombres text,
  p_apellidos text,
  p_fecha_nacimiento date,
  p_parentesco public.parentesco default null
) returns uuid language plpgsql security definer set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_estudiante uuid;
  v_repre uuid;
  v_insc uuid;
begin
  if v_uid is null then raise exception 'Debe iniciar sesion'; end if;

  if p_para_menor then
    insert into public.representantes (perfil_id, nombres, apellidos, celular, email)
    select v_uid, p.nombres, p.apellidos, p.celular, p.email
      from public.perfiles p where p.id = v_uid
    on conflict (perfil_id) do update set updated_at = now()
    returning id into v_repre;

    insert into public.perfil_rol (perfil_id, rol) values (v_uid, 'representante')
      on conflict do nothing;

    insert into public.estudiantes (nombres, apellidos, fecha_nacimiento)
      values (p_nombres, p_apellidos, p_fecha_nacimiento) returning id into v_estudiante;

    insert into public.estudiante_representante
      (estudiante_id, representante_id, parentesco, es_contacto_principal)
      values (v_estudiante, v_repre, coalesce(p_parentesco, 'tutor_legal'), true);
  else
    select id into v_estudiante from public.estudiantes where perfil_id = v_uid;
    if v_estudiante is null then
      insert into public.estudiantes (perfil_id, nombres, apellidos, fecha_nacimiento, email)
        select v_uid, p_nombres, p_apellidos, p_fecha_nacimiento, p.email
          from public.perfiles p where p.id = v_uid returning id into v_estudiante;
    end if;
    insert into public.perfil_rol (perfil_id, rol) values (v_uid, 'estudiante')
      on conflict do nothing;
  end if;

  insert into public.inscripciones (estudiante_id, catedra_id, estado, solicitada_por)
    values (v_estudiante, p_catedra_id, 'pendiente', v_uid) returning id into v_insc;
  return v_insc;
end;
$$;

create or replace function public.vincular_cuenta_representante(
  p_representante_id uuid,
  p_perfil_id uuid
) returns void language plpgsql security definer set search_path = ''
as $$
begin
  if not public.es_admin() then raise exception 'Solo un administrador'; end if;
  if exists (select 1 from public.representantes
              where perfil_id = p_perfil_id and id <> p_representante_id) then
    raise exception 'Ese perfil ya esta vinculado a otro representante';
  end if;
  update public.representantes set perfil_id = p_perfil_id, updated_at = now()
   where id = p_representante_id;
  insert into public.perfil_rol (perfil_id, rol) values (p_perfil_id, 'representante')
    on conflict do nothing;
end;
$$;

-- ============================================================================
-- 5. Triggers
-- ============================================================================

create trigger trg_perfiles_updated before update on public.perfiles
  for each row execute function public.set_updated_at();
create trigger trg_cursos_updated before update on public.cursos
  for each row execute function public.set_updated_at();
create trigger trg_docentes_updated before update on public.docentes
  for each row execute function public.set_updated_at();
create trigger trg_estudiantes_updated before update on public.estudiantes
  for each row execute function public.set_updated_at();
create trigger trg_programas_updated before update on public.programas
  for each row execute function public.set_updated_at();
create trigger trg_representantes_updated before update on public.representantes
  for each row execute function public.set_updated_at();
create trigger trg_acuerdos_updated before update on public.acuerdos_pago
  for each row execute function public.set_updated_at();

create trigger trg_resena_puntuacion after insert or delete or update on public.curso_resenas
  for each row execute function public.recalcular_puntuacion_curso();

create trigger trg_controlar_cupo before insert or update on public.inscripciones
  for each row execute function public.controlar_cupo();
create trigger trg_impedir_autoinscripcion before insert on public.inscripciones
  for each row execute function public.impedir_autoinscripcion();
create trigger trg_menor_requiere_representante before insert on public.inscripciones
  for each row execute function public.exigir_representante_menor();

create trigger trg_pago_recalcula after insert or delete or update on public.pagos
  for each row execute function public.recalcular_cuota();

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();
create trigger on_auth_user_email_updated after update of email on auth.users
  for each row execute function public.sync_email_perfil();

-- ============================================================================
-- 6. Vistas
-- ============================================================================

create view public.v_estado_cuenta as
select
  c.id as cuota_id,
  e.id as estudiante_id,
  (e.nombres || ' ' || e.apellidos) as estudiante,
  c.acuerdo_id,
  c.periodo_mes,
  c.monto,
  c.monto_pagado,
  (c.monto - c.monto_pagado) as saldo,
  c.fecha_vencimiento,
  case
    when c.estado = 'condonada'::public.estado_cuota then 'condonada'::text
    when c.monto_pagado >= c.monto then 'pagada'::text
    when c.fecha_vencimiento < CURRENT_DATE then 'vencida'::text
    when c.monto_pagado > 0::numeric then 'parcial'::text
    else 'pendiente'::text
  end as estado_efectivo,
  greatest(coalesce((CURRENT_DATE - c.fecha_vencimiento), 0), 0) as dias_mora
from public.cuotas c
join public.acuerdos_pago a on a.id = c.acuerdo_id
join public.estudiantes e on e.id = a.estudiante_id;

alter view public.v_estado_cuenta set (security_invoker = on);

create view public.v_cobranza_familia as
select
  r.id as representante_id,
  (coalesce(p.nombres, r.nombres) || ' ' || coalesce(p.apellidos, r.apellidos)) as representante,
  coalesce(p.celular, r.celular) as celular,
  ec.periodo_mes,
  count(*) as hijos_con_cuota,
  string_agg((ec.estudiante || ': ' || to_char(ec.saldo, 'FM999990.00')), ' · ' order by ec.estudiante) as detalle,
  sum(ec.monto) as total_mes,
  sum(ec.saldo) as saldo_total,
  max(ec.dias_mora) as dias_mora_max
from public.v_estado_cuenta ec
join public.estudiante_representante er on er.estudiante_id = ec.estudiante_id and er.es_contacto_principal
join public.representantes r on r.id = er.representante_id
left join public.perfiles p on p.id = r.perfil_id
group by r.id, p.nombres, r.nombres, p.apellidos, r.apellidos, p.celular, r.celular, ec.periodo_mes;

alter view public.v_cobranza_familia set (security_invoker = on);

create view public.v_estudiantes as
select
  e.id,
  e.perfil_id,
  e.nombres,
  e.apellidos,
  e.cedula,
  e.fecha_nacimiento,
  e.celular,
  e.email,
  e.avatar_public_id,
  e.nivel_musical,
  e.fecha_ingreso,
  e.biografia_corta,
  e.activo,
  e.created_at,
  e.updated_at,
  (extract(year from age((CURRENT_DATE)::timestamp with time zone, (e.fecha_nacimiento)::timestamp with time zone)))::integer as edad,
  (e.fecha_nacimiento > (CURRENT_DATE - '18 years'::interval)) as es_menor,
  (e.perfil_id is not null) as tiene_cuenta,
  r.id as representante_id,
  (coalesce(p.nombres, r.nombres) || ' ' || coalesce(p.apellidos, r.apellidos)) as representante_principal,
  coalesce(p.celular, r.celular) as representante_celular,
  coalesce(p.email, r.email) as representante_email,
  er.parentesco
from public.estudiantes e
left join public.estudiante_representante er on er.estudiante_id = e.id and er.es_contacto_principal
left join public.representantes r on r.id = er.representante_id
left join public.perfiles p on p.id = r.perfil_id;

alter view public.v_estudiantes set (security_invoker = on);

create view public.v_promedio_academico as
select
  i.id as inscripcion_id,
  i.estudiante_id,
  i.catedra_id,
  round(((sum((cal.nota / ev.nota_maxima) * ev.ponderacion) / nullif(sum(ev.ponderacion), 0::numeric)) * 10::numeric), 2) as promedio_sobre_10,
  count(cal.*) as evaluaciones_rendidas
from public.inscripciones i
join public.calificaciones cal on cal.inscripcion_id = i.id
join public.evaluaciones ev on ev.id = cal.evaluacion_id
group by i.id, i.estudiante_id, i.catedra_id;

alter view public.v_promedio_academico set (security_invoker = on);

create view public.v_representantes_vinculables as
select
  r.id as representante_id,
  (r.nombres || ' ' || r.apellidos) as representante,
  r.email,
  r.celular,
  r.cedula,
  p.id as perfil_sugerido,
  (p.nombres || ' ' || p.apellidos) as perfil_nombre
from public.representantes r
join public.perfiles p on lower((p.email)::text) = lower((r.email)::text)
where r.perfil_id is null;

alter view public.v_representantes_vinculables set (security_invoker = on);

create view public.v_solicitudes_matricula as
select
  i.id as inscripcion_id,
  i.fecha_inscripcion,
  e.id as estudiante_id,
  (e.nombres || ' ' || e.apellidos) as estudiante,
  (e.fecha_nacimiento > (CURRENT_DATE - '18 years'::interval)) as es_menor,
  cur.nombre as curso,
  cat.codigo as catedra,
  (p.nombres || ' ' || p.apellidos) as solicitada_por,
  (select count(*) from public.inscripciones x
    where x.catedra_id = i.catedra_id and x.estado = 'activa'::public.estado_inscripcion) as cupos_ocupados,
  cat.cupo_maximo
from public.inscripciones i
join public.estudiantes e on e.id = i.estudiante_id
join public.catedras cat on cat.id = i.catedra_id
join public.cursos cur on cur.id = cat.curso_id
left join public.perfiles p on p.id = i.solicitada_por
where i.estado = 'pendiente'::public.estado_inscripcion;

alter view public.v_solicitudes_matricula set (security_invoker = on);

-- ============================================================================
-- 7. Row Level Security
-- ============================================================================

alter table public.actividades enable row level security;
alter table public.acuerdos_pago enable row level security;
alter table public.asistencias enable row level security;
alter table public.calificaciones enable row level security;
alter table public.catedra_horarios enable row level security;
alter table public.catedras enable row level security;
alter table public.certificados enable row level security;
alter table public.configuracion_sitio enable row level security;
alter table public.cuotas enable row level security;
alter table public.curso_habilidades enable row level security;
alter table public.curso_lecciones enable row level security;
alter table public.curso_modulos enable row level security;
alter table public.curso_resenas enable row level security;
alter table public.cursos enable row level security;
alter table public.docente_formacion enable row level security;
alter table public.docente_instrumento enable row level security;
alter table public.docente_portafolio enable row level security;
alter table public.docente_reconocimientos enable row level security;
alter table public.docentes enable row level security;
alter table public.estudiante_instrumento enable row level security;
alter table public.estudiante_representante enable row level security;
alter table public.estudiantes enable row level security;
alter table public.evaluaciones enable row level security;
alter table public.favoritos enable row level security;
alter table public.galeria_medios enable row level security;
alter table public.inscripciones enable row level security;
alter table public.instrumentos enable row level security;
alter table public.materiales enable row level security;
alter table public.metricas_academia enable row level security;
alter table public.pagos enable row level security;
alter table public.perfil_rol enable row level security;
alter table public.perfiles enable row level security;
alter table public.programa_curso enable row level security;
alter table public.programas enable row level security;
alter table public.progreso_lecciones enable row level security;
alter table public.registros_practica enable row level security;
alter table public.representantes enable row level security;
alter table public.secciones_institucionales enable row level security;
alter table public.sesiones enable row level security;
alter table public.solicitudes enable row level security;
alter table public.testimonios enable row level security;
alter table public.tipos_instrumento enable row level security;

-- Políticas: administración
create policy "admin gestiona actividades" on public.actividades for all to authenticated using (public.es_admin()) with check (public.es_admin());
create policy "admin gestiona acuerdos" on public.acuerdos_pago for all to authenticated using (public.es_admin()) with check (public.es_admin());
create policy "docente registra asistencia" on public.asistencias for all to authenticated using (exists (select 1 from public.inscripciones i join public.catedras c on c.id = i.catedra_id where i.id = asistencias.inscripcion_id and c.docente_id = auth.uid()) or public.es_admin()) with check (exists (select 1 from public.inscripciones i join public.catedras c on c.id = i.catedra_id where i.id = asistencias.inscripcion_id and c.docente_id = auth.uid()) or public.es_admin());
create policy "docente califica" on public.calificaciones for all to authenticated using (exists (select 1 from public.inscripciones i join public.catedras c on c.id = i.catedra_id where i.id = calificaciones.inscripcion_id and c.docente_id = auth.uid()) or public.es_admin()) with check (exists (select 1 from public.inscripciones i join public.catedras c on c.id = i.catedra_id where i.id = calificaciones.inscripcion_id and c.docente_id = auth.uid()) or public.es_admin());
create policy "admin gestiona horarios" on public.catedra_horarios for all to authenticated using (public.es_admin()) with check (public.es_admin());
create policy "admin gestiona catedras" on public.catedras for all to authenticated using (public.es_admin()) with check (public.es_admin());
create policy "admin emite certificados" on public.certificados for all to authenticated using (public.es_admin()) with check (public.es_admin());
create policy "admin gestiona configuracion" on public.configuracion_sitio for all to authenticated using (public.es_admin()) with check (public.es_admin());
create policy "admin gestiona cuotas" on public.cuotas for all to authenticated using (public.es_admin()) with check (public.es_admin());
create policy "admin gestiona habilidades" on public.curso_habilidades for all to authenticated using (public.es_admin()) with check (public.es_admin());
create policy "admin gestiona lecciones" on public.curso_lecciones for all to authenticated using (public.es_admin()) with check (public.es_admin());
create policy "admin gestiona modulos" on public.curso_modulos for all to authenticated using (public.es_admin()) with check (public.es_admin());
create policy "admin gestiona resenas" on public.curso_resenas for all to authenticated using (public.es_admin()) with check (public.es_admin());
create policy "admin gestiona cursos" on public.cursos for all to authenticated using (public.es_admin()) with check (public.es_admin());
create policy "docente gestiona su formacion" on public.docente_formacion for all to authenticated using ((docente_id = auth.uid()) or public.es_admin()) with check ((docente_id = auth.uid()) or public.es_admin());
create policy "docente gestiona sus instrumentos" on public.docente_instrumento for all to authenticated using ((docente_id = auth.uid()) or public.es_admin()) with check ((docente_id = auth.uid()) or public.es_admin());
create policy "docente gestiona su portafolio" on public.docente_portafolio for all to authenticated using ((docente_id = auth.uid()) or public.es_admin()) with check ((docente_id = auth.uid()) or public.es_admin());
create policy "docente gestiona sus reconocimientos" on public.docente_reconocimientos for all to authenticated using ((docente_id = auth.uid()) or public.es_admin()) with check ((docente_id = auth.uid()) or public.es_admin());
create policy "admin gestiona docentes" on public.docentes for all to authenticated using (public.es_admin()) with check (public.es_admin());
create policy "el docente edita su propio perfil" on public.docentes for update to authenticated using (perfil_id = auth.uid()) with check (perfil_id = auth.uid());
create policy "admin gestiona instrumentos del estudiante" on public.estudiante_instrumento for all to authenticated using (public.es_admin()) with check (public.es_admin());
create policy "admin gestiona vinculos" on public.estudiante_representante for all to authenticated using (public.es_admin()) with check (public.es_admin());
create policy "admin gestiona estudiantes" on public.estudiantes for all to authenticated using (public.es_admin()) with check (public.es_admin());
create policy "docente gestiona evaluaciones" on public.evaluaciones for all to authenticated using (exists (select 1 from public.catedras c where c.id = evaluaciones.catedra_id and c.docente_id = auth.uid()) or public.es_admin()) with check (exists (select 1 from public.catedras c where c.id = evaluaciones.catedra_id and c.docente_id = auth.uid()) or public.es_admin());
create policy "cada quien gestiona sus favoritos" on public.favoritos for all to authenticated using (perfil_id = auth.uid()) with check (perfil_id = auth.uid());
create policy "admin gestiona galeria" on public.galeria_medios for all to authenticated using (public.es_admin()) with check (public.es_admin());
create policy "admin gestiona inscripciones" on public.inscripciones for all to authenticated using (public.es_admin()) with check (public.es_admin());
create policy "admin gestiona instrumentos" on public.instrumentos for all to authenticated using (public.es_admin()) with check (public.es_admin());
create policy "docente sube material" on public.materiales for all to authenticated using (exists (select 1 from public.catedras c where c.id = materiales.catedra_id and c.docente_id = auth.uid()) or public.es_admin()) with check (exists (select 1 from public.catedras c where c.id = materiales.catedra_id and c.docente_id = auth.uid()) or public.es_admin());
create policy "admin gestiona metricas" on public.metricas_academia for all to authenticated using (public.es_admin()) with check (public.es_admin());
create policy "admin gestiona pagos" on public.pagos for all to authenticated using (public.es_admin()) with check (public.es_admin());
create policy "solo admin asigna roles" on public.perfil_rol for all to authenticated using (public.es_admin()) with check (public.es_admin());
create policy "admin gestiona perfiles" on public.perfiles for all to authenticated using (public.es_admin()) with check (public.es_admin());
create policy "admin gestiona vinculos programa curso" on public.programa_curso for all to authenticated using (public.es_admin()) with check (public.es_admin());
create policy "admin gestiona programas" on public.programas for all to authenticated using (public.es_admin()) with check (public.es_admin());
create policy "docente y admin gestionan progreso" on public.progreso_lecciones for all to authenticated using (exists (select 1 from public.inscripciones i join public.catedras c on c.id = i.catedra_id where i.id = progreso_lecciones.inscripcion_id and c.docente_id = auth.uid()) or public.es_admin()) with check (exists (select 1 from public.inscripciones i join public.catedras c on c.id = i.catedra_id where i.id = progreso_lecciones.inscripcion_id and c.docente_id = auth.uid()) or public.es_admin());
create policy "practica propia" on public.registros_practica for all to authenticated using ((estudiante_id in (select public.estudiantes_accesibles())) or public.es_admin()) with check ((estudiante_id in (select public.estudiantes_accesibles())) or public.es_admin());
create policy "admin gestiona representantes" on public.representantes for all to authenticated using (public.es_admin()) with check (public.es_admin());
create policy "admin gestiona secciones" on public.secciones_institucionales for all to authenticated using (public.es_admin()) with check (public.es_admin());
create policy "docente gestiona sus sesiones" on public.sesiones for all to authenticated using (exists (select 1 from public.catedras c where c.id = sesiones.catedra_id and c.docente_id = auth.uid()) or public.es_admin()) with check (exists (select 1 from public.catedras c where c.id = sesiones.catedra_id and c.docente_id = auth.uid()) or public.es_admin());
create policy "admin gestiona solicitudes" on public.solicitudes for all to authenticated using (public.es_admin()) with check (public.es_admin());
create policy "admin gestiona testimonios" on public.testimonios for all to authenticated using (public.es_admin()) with check (public.es_admin());
create policy "admin gestiona tipos" on public.tipos_instrumento for all to authenticated using (public.es_admin()) with check (public.es_admin());

-- Políticas: lectura pública (anon + authenticated)
create policy "publico lee horarios" on public.catedra_horarios for select to anon, authenticated using (true);
create policy "publico lee catedras de cursos publicados" on public.catedras for select to anon, authenticated using (exists (select 1 from public.cursos c where c.id = catedras.curso_id and c.publicado));
create policy "publico lee configuracion" on public.configuracion_sitio for select to anon, authenticated using (true);
create policy "publico lee habilidades de cursos publicados" on public.curso_habilidades for select to anon, authenticated using (exists (select 1 from public.cursos c where c.id = curso_habilidades.curso_id and c.publicado));
create policy "publico lee lecciones de cursos publicados" on public.curso_lecciones for select to anon, authenticated using (exists (select 1 from public.curso_modulos m join public.cursos c on c.id = m.curso_id where m.id = curso_lecciones.modulo_id and c.publicado));
create policy "publico lee modulos de cursos publicados" on public.curso_modulos for select to anon, authenticated using (exists (select 1 from public.cursos c where c.id = curso_modulos.curso_id and c.publicado));
create policy "publico lee resenas publicadas" on public.curso_resenas for select to anon, authenticated using (publicado or (estudiante_id in (select public.estudiantes_accesibles())));
create policy "publico lee cursos publicados" on public.cursos for select to anon, authenticated using (publicado);
create policy "publico lee formacion de docentes publicados" on public.docente_formacion for select to anon, authenticated using (exists (select 1 from public.docentes d where d.perfil_id = docente_formacion.docente_id and d.publicado));
create policy "publico lee instrumentos de docentes publicados" on public.docente_instrumento for select to anon, authenticated using (exists (select 1 from public.docentes d where d.perfil_id = docente_instrumento.docente_id and d.publicado));
create policy "publico lee portafolio publicado" on public.docente_portafolio for select to anon, authenticated using (publicado and (exists (select 1 from public.docentes d where d.perfil_id = docente_portafolio.docente_id and d.publicado)));
create policy "publico lee reconocimientos de docentes publicados" on public.docente_reconocimientos for select to anon, authenticated using (exists (select 1 from public.docentes d where d.perfil_id = docente_reconocimientos.docente_id and d.publicado));
create policy "publico lee docentes publicados" on public.docentes for select to anon, authenticated using (publicado);
create policy "publico lee galeria publicada" on public.galeria_medios for select to anon, authenticated using (publicado);
create policy "lectura publica de instrumentos activos" on public.instrumentos for select to anon, authenticated using (activo);
create policy "acceso escalonado a materiales" on public.materiales for select to anon, authenticated using ((visible_para = 'publico'::public.visibilidad_material) or ((visible_para = 'registrados'::public.visibilidad_material) and (auth.uid() is not null)) or ((visible_para = 'inscritos'::public.visibilidad_material) and public.matriculado_en(catedra_id)) or ((visible_para = 'docentes'::public.visibilidad_material) and public.es_docente()) or public.es_admin());
create policy "publico lee metricas publicadas" on public.metricas_academia for select to anon, authenticated using (publicado);
create policy "publico lee vinculos de cursos publicados" on public.programa_curso for select to anon, authenticated using (exists (select 1 from public.cursos c where c.id = programa_curso.curso_id and c.publicado));
create policy "publico lee programas publicados" on public.programas for select to anon, authenticated using (publicado);
create policy "publico lee secciones publicadas" on public.secciones_institucionales for select to anon, authenticated using (publicado);
create policy "publico lee testimonios publicados" on public.testimonios for select to anon, authenticated using (publicado);
create policy "lectura publica de tipos activos" on public.tipos_instrumento for select to anon, authenticated using (activo);

-- Políticas: acceso a datos propios
create policy "actividad propia" on public.actividades for select to authenticated using ((estudiante_id in (select public.estudiantes_accesibles())) or (perfil_id = auth.uid()) or public.es_admin());
create policy "lectura del acuerdo propio" on public.acuerdos_pago for select to authenticated using (estudiante_id in (select public.estudiantes_accesibles()));
create policy "acceso a asistencia propia" on public.asistencias for select to authenticated using ((exists (select 1 from public.inscripciones i where i.id = asistencias.inscripcion_id and i.estudiante_id in (select public.estudiantes_accesibles()))) or public.es_admin() or (exists (select 1 from public.inscripciones i join public.catedras c on c.id = i.catedra_id where i.id = asistencias.inscripcion_id and c.docente_id = auth.uid())));
create policy "acceso a calificaciones propias" on public.calificaciones for select to authenticated using ((exists (select 1 from public.inscripciones i where i.id = calificaciones.inscripcion_id and i.estudiante_id in (select public.estudiantes_accesibles()))) or public.es_admin() or (exists (select 1 from public.inscripciones i join public.catedras c on c.id = i.catedra_id where i.id = calificaciones.inscripcion_id and c.docente_id = auth.uid())));
create policy "acceso a certificados propios" on public.certificados for select to authenticated using ((exists (select 1 from public.inscripciones i where i.id = certificados.inscripcion_id and i.estudiante_id in (select public.estudiantes_accesibles()))) or public.es_admin());
create policy "lectura de cuotas propias" on public.cuotas for select to authenticated using (exists (select 1 from public.acuerdos_pago a where a.id = cuotas.acuerdo_id and a.estudiante_id in (select public.estudiantes_accesibles())));
create policy "el estudiante escribe su resena" on public.curso_resenas for insert to authenticated with check (estudiante_id in (select public.estudiantes_accesibles()));
create policy "acceso a instrumentos del expediente propio" on public.estudiante_instrumento for select to authenticated using ((estudiante_id in (select public.estudiantes_accesibles())) or public.es_admin());
create policy "vinculo visible para el representante" on public.estudiante_representante for select to authenticated using ((estudiante_id in (select public.estudiantes_accesibles())) or public.es_admin());
create policy "expediente propio o representado" on public.estudiantes for select to authenticated using ((id in (select public.estudiantes_accesibles())) or public.es_admin());
create policy "acceso a evaluaciones de mi catedra" on public.evaluaciones for select to authenticated using (public.matriculado_en(catedra_id) or public.es_admin() or (exists (select 1 from public.catedras c where c.id = evaluaciones.catedra_id and c.docente_id = auth.uid())));
create policy "expediente propio o representado" on public.inscripciones for select to authenticated using ((estudiante_id in (select public.estudiantes_accesibles())) or public.es_admin() or (exists (select 1 from public.catedras c where c.id = inscripciones.catedra_id and c.docente_id = auth.uid())));
create policy "lectura de pagos propios" on public.pagos for select to authenticated using (exists (select 1 from public.cuotas c join public.acuerdos_pago a on a.id = c.acuerdo_id where c.id = pagos.cuota_id and a.estudiante_id in (select public.estudiantes_accesibles())));
create policy "cada quien ve sus roles" on public.perfil_rol for select to authenticated using ((perfil_id = auth.uid()) or public.es_admin());
create policy "cada quien edita su perfil" on public.perfiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "cada quien ve su perfil" on public.perfiles for select to authenticated using (id = auth.uid());
create policy "acceso a progreso propio" on public.progreso_lecciones for select to authenticated using ((exists (select 1 from public.inscripciones i where i.id = progreso_lecciones.inscripcion_id and i.estudiante_id in (select public.estudiantes_accesibles()))) or public.es_admin() or (exists (select 1 from public.inscripciones i join public.catedras c on c.id = i.catedra_id where i.id = progreso_lecciones.inscripcion_id and c.docente_id = auth.uid())));
create policy "el representante se ve a si mismo" on public.representantes for select to authenticated using ((perfil_id = auth.uid()) or public.es_admin());
create policy "acceso a sesiones de mi catedra" on public.sesiones for select to authenticated using (public.matriculado_en(catedra_id) or public.es_admin() or (exists (select 1 from public.catedras c where c.id = sesiones.catedra_id and c.docente_id = auth.uid())));

-- Políticas: inserción pública
create policy "cualquiera envia solicitud" on public.solicitudes for insert to anon, authenticated with check (consentimiento_datos);

-- ============================================================================
-- 8. Grants
-- ============================================================================

grant all on public.actividades to anon, authenticated, service_role;
grant all on public.acuerdos_pago to anon, authenticated, service_role;
grant all on public.asistencias to anon, authenticated, service_role;
grant all on public.calificaciones to anon, authenticated, service_role;
grant all on public.catedra_horarios to anon, authenticated, service_role;
grant all on public.catedras to anon, authenticated, service_role;
grant all on public.certificados to anon, authenticated, service_role;
grant all on public.configuracion_sitio to anon, authenticated, service_role;
grant all on public.cuotas to anon, authenticated, service_role;
grant all on public.curso_habilidades to anon, authenticated, service_role;
grant all on public.curso_lecciones to anon, authenticated, service_role;
grant all on public.curso_modulos to anon, authenticated, service_role;
grant all on public.curso_resenas to anon, authenticated, service_role;
grant all on public.cursos to anon, authenticated, service_role;
grant all on public.docente_formacion to anon, authenticated, service_role;
grant all on public.docente_instrumento to anon, authenticated, service_role;
grant all on public.docente_portafolio to anon, authenticated, service_role;
grant all on public.docente_reconocimientos to anon, authenticated, service_role;
grant all on public.docentes to anon, authenticated, service_role;
grant all on public.estudiante_instrumento to anon, authenticated, service_role;
grant all on public.estudiante_representante to anon, authenticated, service_role;
grant all on public.estudiantes to anon, authenticated, service_role;
grant all on public.evaluaciones to anon, authenticated, service_role;
grant all on public.favoritos to anon, authenticated, service_role;
grant all on public.galeria_medios to anon, authenticated, service_role;
grant all on public.inscripciones to anon, authenticated, service_role;
grant all on public.instrumentos to anon, authenticated, service_role;
grant all on public.materiales to anon, authenticated, service_role;
grant all on public.metricas_academia to anon, authenticated, service_role;
grant all on public.pagos to anon, authenticated, service_role;
grant all on public.perfil_rol to anon, authenticated, service_role;
grant all on public.perfiles to anon, authenticated, service_role;
grant all on public.programa_curso to anon, authenticated, service_role;
grant all on public.programas to anon, authenticated, service_role;
grant all on public.progreso_lecciones to anon, authenticated, service_role;
grant all on public.registros_practica to anon, authenticated, service_role;
grant all on public.representantes to anon, authenticated, service_role;
grant all on public.secciones_institucionales to anon, authenticated, service_role;
grant all on public.sesiones to anon, authenticated, service_role;
grant all on public.solicitudes to anon, authenticated, service_role;
grant all on public.testimonios to anon, authenticated, service_role;
grant all on public.tipos_instrumento to anon, authenticated, service_role;

grant select on public.perfil_rol to supabase_auth_admin;

grant execute on function public.aprobar_matricula(uuid, numeric, smallint, text) to anon, authenticated, service_role;
grant execute on function public.custom_access_token_hook(jsonb) to postgres, service_role, supabase_auth_admin;
grant execute on function public.es_admin() to anon, authenticated, service_role;
grant execute on function public.es_docente() to anon, authenticated, service_role;
grant execute on function public.estudiantes_accesibles() to anon, authenticated, service_role;
grant execute on function public.generar_cuotas_mes(date) to anon, authenticated, service_role;
grant execute on function public.handle_new_user() to supabase_auth_admin;
grant execute on function public.matriculado_en(uuid) to anon, authenticated, service_role;
grant execute on function public.roles_actuales() to anon, authenticated, service_role;
grant execute on function public.solicitar_matricula(uuid, boolean, text, text, date, public.parentesco) to anon, authenticated, service_role;
grant execute on function public.sync_email_perfil() to supabase_auth_admin;
grant execute on function public.tiene_matricula_activa() to anon, authenticated, service_role;
grant execute on function public.tiene_rol(text) to anon, authenticated, service_role;
grant execute on function public.vincular_cuenta_representante(uuid, uuid) to anon, authenticated, service_role;