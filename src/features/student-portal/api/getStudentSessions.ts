import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import { toLocalDateString } from "@/shared/lib/date";

import type { IStudentSessions, TEstadoSesion } from "../model/student-dashboard.types";

export async function getStudentSessions(estudianteId: string): Promise<{
  data: IStudentSessions | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();

  const { data: inscripciones, error: inscError } = await supabase
    .from("inscripciones")
    .select("catedra_id")
    .eq("estudiante_id", estudianteId)
    .eq("estado", "activa");

  if (inscError) {
    return { data: null, error: inscError.message };
  }

  const catedraIds = (inscripciones ?? []).map((item) => item.catedra_id);
  if (catedraIds.length === 0) {
    return { data: { proximas: [], pasadas: [] }, error: null };
  }

  const { data, error } = await supabase
    .from("sesiones")
    .select("id, fecha, hora_inicio, hora_fin, tema, estado, catedras!sesiones_catedra_id_fkey(codigo, cursos(nombre))")
    .in("catedra_id", catedraIds)
    .order("fecha", { ascending: true })
    .limit(300);

  if (error) {
    return { data: null, error: error.message };
  }

  const hoy = toLocalDateString();
  const mapeadas = (data ?? []).map((sesion) => ({
    id: sesion.id,
    fecha: sesion.fecha,
    horaInicio: sesion.hora_inicio,
    horaFin: sesion.hora_fin,
    tema: sesion.tema,
    estado: sesion.estado as TEstadoSesion,
    catedra: sesion.catedras?.codigo ?? "—",
    curso: sesion.catedras?.cursos?.nombre ?? "Curso",
  }));

  const activas = ["programada", "reprogramada"];
  const proximas = mapeadas.filter((item) => item.fecha >= hoy && activas.includes(item.estado));
  const pasadas = mapeadas.filter((item) => item.fecha < hoy || !activas.includes(item.estado)).reverse();

  return { data: { proximas, pasadas }, error: null };
}