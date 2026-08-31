import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IEvaluacionDetalleCalificaciones, TTipoEvaluacion } from "../model/calificacion.types";

export async function getCalificacionesEvaluacion(
  evaluacionId: string
): Promise<{ data: IEvaluacionDetalleCalificaciones | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const { data: evaluacion, error: evError } = await supabase
    .from("evaluaciones")
    .select("id, catedra_id, titulo, tipo, nota_maxima, ponderacion, fecha, catedras(codigo, cursos(nombre))")
    .eq("id", evaluacionId)
    .single();

  if (evError) {
    return { data: null, error: evError.message };
  }

  const [inscripciones, calificacionesExistentes] = await Promise.all([
    supabase
      .from("inscripciones")
      .select("id, estudiante_id, estudiantes(id, nombres, apellidos)")
      .eq("catedra_id", evaluacion.catedra_id)
      .eq("estado", "activa")
      .order("estudiantes(nombres)", { ascending: true }),
    supabase
      .from("calificaciones")
      .select("inscripcion_id, nota, observacion, calificada_en")
      .eq("evaluacion_id", evaluacionId),
  ]);

  if (inscripciones.error) {
    return { data: null, error: inscripciones.error.message };
  }

  const calificacionMap = new Map(
    (calificacionesExistentes.data ?? []).map((c) => [
      c.inscripcion_id,
      { nota: c.nota, observacion: c.observacion, calificadaEn: c.calificada_en },
    ])
  );

  const estudiantes = (inscripciones.data ?? []).map((item) => {
    const prev = calificacionMap.get(item.id);
    const est = item.estudiantes;
    return {
      inscripcionId: item.id,
      estudianteId: item.estudiante_id,
      estudiante: est ? `${est.nombres} ${est.apellidos}`.trim() : "Estudiante",
      nota: prev?.nota != null ? Number(prev.nota) : null,
      observacion: prev?.observacion ?? null,
      calificadaEn: prev?.calificadaEn ?? null,
    };
  });

  return {
    data: {
      evaluacionId: evaluacion.id,
      catedraId: evaluacion.catedra_id,
      codigo: evaluacion.catedras?.codigo ?? "",
      curso: evaluacion.catedras?.cursos?.nombre ?? "",
      titulo: evaluacion.titulo,
      tipo: evaluacion.tipo as TTipoEvaluacion,
      notaMaxima: Number(evaluacion.nota_maxima),
      ponderacion: Number(evaluacion.ponderacion),
      fecha: evaluacion.fecha,
      estudiantes,
    },
    error: null,
  };
}
