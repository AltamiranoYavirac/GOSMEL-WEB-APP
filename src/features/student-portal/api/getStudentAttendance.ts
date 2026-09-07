import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IStudentAttendance, IStudentAsistencia, TEstadoAsistencia } from "../model/student-dashboard.types";

export async function getStudentAttendance(estudianteId: string): Promise<{
  data: IStudentAttendance | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();

  const { data: inscripciones, error: inscError } = await supabase
    .from("inscripciones")
    .select("id")
    .eq("estudiante_id", estudianteId)
    .eq("estado", "activa");

  if (inscError) {
    return { data: null, error: inscError.message };
  }

  const inscripcionIds = (inscripciones ?? []).map((item) => item.id);
  if (inscripcionIds.length === 0) {
    return { data: { items: [], presentes: 0, atrasos: 0, ausentes: 0, justificados: 0, total: 0, porcentajeAsistencia: 0 }, error: null };
  }

  const { data, error } = await supabase
    .from("asistencias")
    .select("estado, observacion, sesion_id, sesiones!asistencias_sesion_id_fkey(fecha, catedras!sesiones_catedra_id_fkey(codigo))")
    .in("inscripcion_id", inscripcionIds)
    .order("sesiones(fecha)", { ascending: false })
    .limit(300);

  if (error) {
    return { data: null, error: error.message };
  }

  const items: IStudentAsistencia[] = (data ?? []).map((row) => ({
    sesionId: row.sesion_id,
    fecha: row.sesiones?.fecha ?? "—",
    estado: row.estado as TEstadoAsistencia,
    observacion: row.observacion,
    catedra: row.sesiones?.catedras?.codigo ?? "—",
  }));

  const presentes = items.filter((item) => item.estado === "presente").length;
  const atrasos = items.filter((item) => item.estado === "atraso").length;
  const ausentes = items.filter((item) => item.estado === "ausente").length;
  const justificados = items.filter((item) => item.estado === "justificado").length;
  const total = items.length;
  const porcentajeAsistencia = total > 0 ? Math.round(((presentes + atrasos) / total) * 100) : 0;

  return {
    data: { items, presentes, atrasos, ausentes, justificados, total, porcentajeAsistencia },
    error: null,
  };
}