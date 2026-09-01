import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { ISesionAsistenciasData, TEstadoAsistencia } from "../model/asistencia.types";

export async function getAsistenciasSesion(
  sesionId: string
): Promise<{ data: ISesionAsistenciasData | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const { data: sesion, error: sesionError } = await supabase
    .from("sesiones")
    .select("id, catedra_id, fecha, tema, catedras(codigo, cursos(nombre))")
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
      .eq("estado", "activa")
      .order("estudiantes(nombres)", { ascending: true }),
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
    ])
  );

  const estudiantes = (inscripciones.data ?? []).map((item) => {
    const prev = asistenciaMap.get(item.id);
    const est = item.estudiantes;
    return {
      inscripcionId: item.id,
      estudianteId: item.estudiante_id,
      estudiante: est ? `${est.nombres} ${est.apellidos}`.trim() : "Estudiante",
      estado: prev?.estado ?? ("presente" as TEstadoAsistencia),
      observacion: prev?.observacion ?? null,
    };
  });

  return {
    data: {
      sesionId: sesion.id,
      catedraId: sesion.catedra_id,
      codigo: sesion.catedras?.codigo ?? "",
      curso: sesion.catedras?.cursos?.nombre ?? "",
      fecha: sesion.fecha,
      tema: sesion.tema,
      estudiantes,
    },
    error: null,
  };
}
