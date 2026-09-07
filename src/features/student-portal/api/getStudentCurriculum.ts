import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IStudentCursoPlan, IStudentModulo } from "../model/student-dashboard.types";

export async function getStudentCurriculum(estudianteId: string): Promise<{
  data: IStudentCursoPlan[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();

  const { data: inscripciones, error: inscError } = await supabase
    .from("inscripciones")
    .select("id, progreso_pct, catedra_id, catedras!inscripciones_catedra_id_fkey(codigo, cursos!catedras_curso_id_fkey(id, nombre))")
    .eq("estudiante_id", estudianteId)
    .eq("estado", "activa");

  if (inscError) {
    return { data: null, error: inscError.message };
  }

  if ((inscripciones ?? []).length === 0) {
    return { data: [], error: null };
  }

  const cursoIds = [...new Set((inscripciones ?? []).map((item) => item.catedras?.cursos?.id).filter(Boolean))];
  const inscripcionIds = (inscripciones ?? []).map((item) => item.id);

  const [modulos, progreso] = await Promise.all([
    cursoIds.length > 0
      ? supabase
          .from("curso_modulos")
          .select("id, curso_id, titulo, descripcion, orden, curso_lecciones!curso_lecciones_modulo_id_fkey(id, titulo, duracion_minutos, orden)")
          .in("curso_id", cursoIds)
          .order("orden", { ascending: true })
      : Promise.resolve({ data: null, error: null }),
    supabase
      .from("progreso_lecciones")
      .select("inscripcion_id, leccion_id, completada")
      .in("inscripcion_id", inscripcionIds),
  ]);

  if (modulos.error || progreso.error) {
    return { data: null, error: modulos.error?.message ?? progreso.error?.message ?? "Error al cargar el temario" };
  }

  const progresoPorInscripcion: Record<string, Record<string, boolean>> = {};
  for (const row of progreso.data ?? []) {
    progresoPorInscripcion[row.inscripcion_id] = {
      ...(progresoPorInscripcion[row.inscripcion_id] ?? {}),
      [row.leccion_id]: row.completada ?? false,
    };
  }

  const modulosPorCurso: Record<string, IStudentModulo[]> = {};
  for (const modulo of modulos.data ?? []) {
    const lecciones = (modulo.curso_lecciones ?? []).map((leccion) => ({
      id: leccion.id,
      titulo: leccion.titulo,
      duracionMinutos: leccion.duracion_minutos,
      completada: false,
    }));
    modulosPorCurso[modulo.curso_id] = [...(modulosPorCurso[modulo.curso_id] ?? []), { id: modulo.id, titulo: modulo.titulo, descripcion: modulo.descripcion, lecciones }];
  }

  const planes: IStudentCursoPlan[] = (inscripciones ?? []).map((inscripcion) => {
    const cursoId = inscripcion.catedras?.cursos?.id;
    const modulosCurso = cursoId ? modulosPorCurso[cursoId] ?? [] : [];
    const completadas = progresoPorInscripcion[inscripcion.id] ?? {};

    const modulos = modulosCurso.map((modulo) => ({
      ...modulo,
      lecciones: modulo.lecciones.map((leccion) => ({ ...leccion, completada: completadas[leccion.id] ?? false })),
    }));

    return {
      cursoId: cursoId ?? "",
      curso: inscripcion.catedras?.cursos?.nombre ?? "Curso",
      catedra: inscripcion.catedras?.codigo ?? "—",
      progresoPct: Number(inscripcion.progreso_pct) || 0,
      modulos,
    };
  });

  return { data: planes, error: null };
}