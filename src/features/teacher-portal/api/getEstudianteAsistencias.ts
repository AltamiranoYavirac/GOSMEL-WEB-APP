import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/api/supabase/database.types";

import type { IEstudianteAsistenciaHistorialItem, TEstadoAsistencia } from "../model/teacher-dashboard.types";

export async function getEstudianteAsistencias(
  inscripcionId: string,
  supabase: SupabaseClient<Database> = createSupabaseBrowserClient(),
): Promise<{ data: IEstudianteAsistenciaHistorialItem[] | null; error: string | null }> {

  const { data, error } = await supabase
    .from("asistencias")
    .select("sesion_id, estado, observacion, sesiones(fecha, hora_inicio, hora_fin, tema)")
    .eq("inscripcion_id", inscripcionId)
    .order("sesiones(fecha)", { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  const items: IEstudianteAsistenciaHistorialItem[] = (data ?? []).map((item) => ({
    sesionId: item.sesion_id,
    fecha: item.sesiones?.fecha ?? "",
    horaInicio: item.sesiones?.hora_inicio ?? "",
    horaFin: item.sesiones?.hora_fin ?? "",
    tema: item.sesiones?.tema ?? null,
    estado: item.estado as TEstadoAsistencia,
    observacion: item.observacion,
  }));

  return { data: items, error: null };
}
