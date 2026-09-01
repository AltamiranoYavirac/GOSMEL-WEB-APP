import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IEvaluacionRow, TTipoEvaluacion } from "../model/evaluacion.types";

export async function getEvaluaciones(): Promise<{
  data: IEvaluacionRow[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("evaluaciones")
    .select(
      "id, titulo, tipo, fecha, ponderacion, nota_maxima, catedra_id, catedras(codigo, cursos(nombre)), calificaciones(nota)"
    )
    .order("created_at", { ascending: false })
    .limit(300);

  if (error) {
    return { data: null, error: error.message };
  }

  const rows: IEvaluacionRow[] = (data ?? []).map((evaluacion) => {
    const notas = (evaluacion.calificaciones ?? [])
      .map((item) => item.nota)
      .filter((nota): nota is number => nota != null);
    const promedio = notas.length > 0 ? notas.reduce((suma, nota) => suma + nota, 0) / notas.length : null;

    return {
      id: evaluacion.id,
      titulo: evaluacion.titulo,
      tipo: evaluacion.tipo as TTipoEvaluacion,
      catedra: evaluacion.catedras?.codigo ?? "Sin cátedra",
      curso: evaluacion.catedras?.cursos?.nombre ?? "—",
      fecha: evaluacion.fecha,
      ponderacion: evaluacion.ponderacion,
      notaMaxima: evaluacion.nota_maxima,
      promedio,
      rendidas: notas.length,
    };
  });

  return { data: rows, error: null };
}