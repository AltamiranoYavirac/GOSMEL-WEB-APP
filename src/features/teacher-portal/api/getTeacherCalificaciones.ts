import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/api/supabase/database.types";

import type { TTipoEvaluacion } from "../model/teacher-dashboard.types";

export interface ICalificacionEstudianteItem {
  inscripcionId: string;
  estudianteId: string;
  estudianteNombre: string;
  nota: number | null;
  observacion: string | null;
  calificadaEn: string | null;
}

export interface ITeacherEvaluacionCalificacionesData {
  evaluacionId: string;
  catedraId: string;
  catedraCodigo: string;
  cursoNombre: string;
  titulo: string;
  tipo: TTipoEvaluacion;
  notaMaxima: number;
  ponderacion: number;
  fecha: string | null;
  estudiantes: ICalificacionEstudianteItem[];
}

export async function getTeacherCalificaciones(
  evaluacionId: string,
  supabase: SupabaseClient<Database> = createSupabaseBrowserClient(),
): Promise<{ data: ITeacherEvaluacionCalificacionesData | null; error: string | null }> {

  const { data: evaluacion, error: evError } = await supabase
    .from("evaluaciones")
    .select("id, catedra_id, titulo, tipo, nota_maxima, ponderacion, fecha, catedras(codigo, cursos(nombre))")
    .eq("id", evaluacionId)
    .single();

  if (evError) {
    return { data: null, error: evError.message };
  }

  const [inscripcionesRes, calificacionesRes] = await Promise.all([
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

  if (inscripcionesRes.error) {
    return { data: null, error: inscripcionesRes.error.message };
  }

  const calificacionMap = new Map(
    (calificacionesRes.data ?? []).map((c) => [
      c.inscripcion_id,
      { nota: c.nota, observacion: c.observacion, calificadaEn: c.calificada_en },
    ])
  );

  const estudiantes: ICalificacionEstudianteItem[] = (inscripcionesRes.data ?? []).map((item) => {
    const prev = calificacionMap.get(item.id);
    const est = item.estudiantes;
    return {
      inscripcionId: item.id,
      estudianteId: item.estudiante_id,
      estudianteNombre: est ? `${est.nombres} ${est.apellidos}`.trim() : "Estudiante",
      nota: prev?.nota != null ? Number(prev.nota) : null,
      observacion: prev?.observacion ?? null,
      calificadaEn: prev?.calificadaEn ?? null,
    };
  });

  return {
    data: {
      evaluacionId: evaluacion.id,
      catedraId: evaluacion.catedra_id,
      catedraCodigo: evaluacion.catedras?.codigo ?? "",
      cursoNombre: evaluacion.catedras?.cursos?.nombre ?? "",
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
