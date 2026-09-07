import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IStudentCalificacion, TTipoEvaluacion } from "../model/student-dashboard.types";

export async function getStudentGrades(estudianteId: string): Promise<{
  data: IStudentCalificacion[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();

  const { data: inscripciones, error: inscError } = await supabase
    .from("inscripciones")
    .select("id, catedra_id")
    .eq("estudiante_id", estudianteId)
    .eq("estado", "activa");

  if (inscError) {
    return { data: null, error: inscError.message };
  }

  const catedraIds = (inscripciones ?? []).map((item) => item.catedra_id);
  const inscripcionIds = (inscripciones ?? []).map((item) => item.id);

  if (catedraIds.length === 0) {
    return { data: [], error: null };
  }

  const { data, error } = await supabase
    .from("evaluaciones")
    .select(
      "id, titulo, tipo, fecha, nota_maxima, ponderacion, catedras!evaluaciones_catedra_id_fkey(codigo, cursos(nombre)), calificaciones!calificaciones_evaluacion_id_fkey(nota, observacion, inscripcion_id)"
    )
    .in("catedra_id", catedraIds)
    .order("fecha", { ascending: false })
    .limit(300);

  if (error) {
    return { data: null, error: error.message };
  }

  const idSet = new Set(inscripcionIds);
  const rows: IStudentCalificacion[] = (data ?? [])
    .map((evaluacion) => {
      const calificacion = (evaluacion.calificaciones ?? []).find((item) => idSet.has(item.inscripcion_id));
      return {
        id: `${evaluacion.id}-${calificacion?.inscripcion_id ?? "sin-nota"}`,
        titulo: evaluacion.titulo,
        tipo: evaluacion.tipo as TTipoEvaluacion,
        fecha: evaluacion.fecha,
        notaMaxima: Number(evaluacion.nota_maxima) || 10,
        ponderacion: evaluacion.ponderacion != null ? Number(evaluacion.ponderacion) : null,
        nota: calificacion?.nota != null ? Number(calificacion.nota) : null,
        observacion: calificacion?.observacion ?? null,
        catedra: evaluacion.catedras?.codigo ?? "—",
        curso: evaluacion.catedras?.cursos?.nombre ?? "Curso",
      };
    })
    .filter((item) => item.nota !== null);

  return { data: rows, error: null };
}