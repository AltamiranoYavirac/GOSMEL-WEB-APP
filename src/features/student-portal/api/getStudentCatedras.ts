import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IStudentCatedra, TNivelCurso, TModalidadCurso } from "../model/student-dashboard.types";

export async function getStudentCatedras(estudianteId: string): Promise<{
  data: IStudentCatedra[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("inscripciones")
    .select(
      "id, progreso_pct, estado, catedra_id, catedras!inscripciones_catedra_id_fkey(codigo, aula, modalidad, cursos(id, nombre, nivel), catedra_horarios(dia_semana, hora_inicio, hora_fin), docentes!catedras_docente_id_fkey(perfiles!docentes_perfil_id_fkey(nombres, apellidos)))"
    )
    .eq("estudiante_id", estudianteId)
    .order("estado", { ascending: true });

  if (error) {
    return { data: null, error: error.message };
  }

  const rows: IStudentCatedra[] = (data ?? []).map((inscripcion) => {
    const catedra = inscripcion.catedras;
    const docente = catedra?.docentes?.perfiles;

    return {
      inscripcionId: inscripcion.id,
      catedraId: inscripcion.catedra_id,
      cursoId: catedra?.cursos?.id ?? "",
      codigo: catedra?.codigo ?? "—",
      curso: catedra?.cursos?.nombre ?? "Curso",
      nivel: (catedra?.cursos?.nivel ?? null) as TNivelCurso | null,
      modalidad: catedra?.modalidad as TModalidadCurso,
      aula: catedra?.aula ?? null,
      docente: docente ? `${docente.nombres} ${docente.apellidos}`.trim() : null,
      estado: inscripcion.estado,
      progresoPct: Number(inscripcion.progreso_pct) || 0,
      horarios: (catedra?.catedra_horarios ?? []).map((horario) => ({
        dia: horario.dia_semana,
        inicio: horario.hora_inicio,
        fin: horario.hora_fin,
      })),
    };
  });

  return { data: rows, error: null };
}