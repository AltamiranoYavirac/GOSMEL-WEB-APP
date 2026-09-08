-- ============================================================================
-- Conectar el sitio público a Supabase.
-- Solicitudes con autor rastreado, RLS de lectura propia, endurecimiento de
-- las RPC de administración y limpieza de código muerto.
-- ============================================================================

-- A1. Rastrear el autor de cada solicitud y permitirle leer las suyas
alter table public.solicitudes
  add column creada_por uuid references auth.users(id) on delete set null;

alter table public.solicitudes
  alter column creada_por set default auth.uid();

drop policy "cualquiera envia solicitud" on public.solicitudes;
create policy "cualquiera envia solicitud"
  on public.solicitudes for insert to anon, authenticated
  with check (
    consentimiento_datos
    and (creada_por is null or creada_por = auth.uid())
  );

create policy "el autor ve sus solicitudes"
  on public.solicitudes for select to authenticated
  using (creada_por = auth.uid());

-- A2. Las RPC de administración son SECURITY DEFINER; solo anon/public pierden
-- EXECUTE. authenticated conserva el permiso porque el panel admin las invoca
-- con el JWT del administrador y el gate es_admin() interno ya bloquea al
-- resto de usuarios autenticados.
revoke execute on function
  public.aprobar_matricula(uuid, numeric, smallint, text, numeric),
  public.rechazar_matricula(uuid, text),
  public.matricular_estudiante_directo(uuid, uuid, numeric, smallint, text, numeric),
  public.dar_de_baja_estudiante(uuid, text, boolean),
  public.emitir_certificado(uuid, boolean),
  public.generar_cuotas_mes(date),
  public.generar_sesiones_catedra(uuid, date, date),
  public.vincular_cuenta_estudiante(uuid, uuid),
  public.vincular_cuenta_representante(uuid, uuid)
from public, anon;

-- A3. Las funciones trigger se ejecutan por PostgreSQL; no deben poder
-- invocarse mediante RPC ni por ningún rol de cliente.
revoke execute on function
  public.controlar_cupo(),
  public.exigir_representante_menor(),
  public.impedir_autoinscripcion(),
  public.recalcular_cuota(),
  public.recalcular_progreso_inscripcion(),
  public.recalcular_puntuacion_curso(),
  public.sync_email_perfil(),
  public.handle_new_user()
from public, anon, authenticated;

-- A4. convertir_solicitud_lead inventa datos de estudiante y nadie la usa;
-- el flujo vivo es CrearMatriculaDialog + solicitar_matricula.
drop function if exists public.convertir_solicitud_lead(uuid, uuid);

-- A5. search_path fijo para la función trigger (advisor function_search_path_mutable)
alter function public.set_updated_at() set search_path = '';
