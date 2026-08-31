import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { ISesionRow, TEstadoSesion } from "../model/horario.types";

export async function getSesiones(): Promise<{
  data: ISesionRow[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("sesiones")
    .select("id, fecha, hora_inicio, hora_fin, tema, estado, catedra_id, catedras(codigo, cursos(nombre)), asistencias(estado)")
    .order("fecha", { ascending: false })
    .limit(300);

  if (error) {
    return { data: null, error: error.message };
  }

  const rows: ISesionRow[] = (data ?? []).map((sesion) => {
    const asistencias = sesion.asistencias ?? [];

    return {
      id: sesion.id,
      catedra: sesion.catedras?.codigo ?? "Sin cátedra",
      curso: sesion.catedras?.cursos?.nombre ?? "—",
      fecha: sesion.fecha,
      horaInicio: sesion.hora_inicio,
      horaFin: sesion.hora_fin,
      tema: sesion.tema,
      presentes: asistencias.filter((item) => item.estado === "presente").length,
      totalAsistencia: asistencias.length,
      estado: sesion.estado as TEstadoSesion,
    };
  });

  return { data: rows, error: null };
}