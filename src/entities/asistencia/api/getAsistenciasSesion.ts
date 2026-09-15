import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/api/supabase/database.types";

import type { IAsistenciaEstudianteItem, ISesionAsistenciasData, TEstadoAsistencia } from "../model/asistencia.types";

export async function getAsistenciasSesion(
  sesionId: string,
  supabase: SupabaseClient<Database> = createSupabaseBrowserClient(),
): Promise<{ data: ISesionAsistenciasData | null; error: string | null }> {
  const { data: sesion, error: sesionError } = await supabase
    .from("sesiones")
    .select("id, catedra_id, fecha, hora_inicio, hora_fin, tema, catedras(codigo, cursos(nombre))")
    .eq("id", sesionId)
    .single();

  if (sesionError) {
    return { data: null, error: sesionError.message };
  }

  const [inscripciones, asistenciasExistentes] = await Promise.all([
    supabase
      .from("inscripciones")
      .select("id, estudiante_id, estudiantes(id, nombres, apellidos)")
      .eq("catedra_id", sesion.catedra_id)
      .eq("estado", "activa"),
    supabase
      .from("asistencias")
      .select("inscripcion_id, estado, observacion")
      .eq("sesion_id", sesionId),
  ]);

  if (inscripciones.error) {
    return { data: null, error: inscripciones.error.message };
  }

  const asistenciaMap = new Map(
    (asistenciasExistentes.data ?? []).map((a) => [
      a.inscripcion_id,
      { estado: a.estado as TEstadoAsistencia, observacion: a.observacion },
    ]),
  );

  const estudiantes: IAsistenciaEstudianteItem[] = (inscripciones.data ?? [])
    .map((item) => {
      const previa = asistenciaMap.get(item.id);
      const estudiante = item.estudiantes;

      return {
        inscripcionId: item.id,
        estudianteId: item.estudiante_id,
        estudianteNombre: [estudiante?.nombres, estudiante?.apellidos].filter(Boolean).join(" ") || "Estudiante",
        estado: previa?.estado ?? ("presente" as TEstadoAsistencia),
        observacion: previa?.observacion ?? null,
      };
    })
    .sort((a, b) => a.estudianteNombre.localeCompare(b.estudianteNombre));

  return {
    data: {
      sesionId: sesion.id,
      catedraId: sesion.catedra_id,
      codigo: sesion.catedras?.codigo ?? "",
      curso: sesion.catedras?.cursos?.nombre ?? "",
      fecha: sesion.fecha,
      horaInicio: sesion.hora_inicio,
      horaFin: sesion.hora_fin,
      tema: sesion.tema,
      estudiantes,
    },
    error: null,
  };
}
