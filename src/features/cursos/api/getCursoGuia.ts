import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type {
  ICursoGuia,
  TEstadoCatedra,
  TModalidadCurso,
  TNivelCurso,
} from "../model/curso-guia.types";

export async function getCursoGuia(
  cursoId: string
): Promise<{ data: ICursoGuia | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("cursos")
    .select(
      "id, nombre, descripcion, resumen, nivel, modalidad, duracion_semanas, horas_totales, curso_modulos(id, orden, titulo, descripcion, curso_lecciones(id, orden, titulo, descripcion, duracion_minutos)), catedras(id, codigo, estado, modalidad, docente_id, docentes!catedras_docente_id_fkey(perfiles!docentes_perfil_id_fkey(nombres, apellidos)))"
    )
    .eq("id", cursoId)
    .maybeSingle();

  if (error) {
    return { data: null, error: error.message };
  }

  if (!data) {
    return { data: null, error: null };
  }

  const modulos = (data.curso_modulos ?? [])
    .slice()
    .sort((a, b) => a.orden - b.orden)
    .map((modulo) => ({
      id: modulo.id,
      titulo: modulo.titulo,
      descripcion: modulo.descripcion,
      lecciones: (modulo.curso_lecciones ?? [])
        .slice()
        .sort((a, b) => a.orden - b.orden)
        .map((leccion) => ({
          id: leccion.id,
          titulo: leccion.titulo,
          descripcion: leccion.descripcion,
          duracionMinutos: leccion.duracion_minutos,
        })),
    }));

  const catedras = (data.catedras ?? []).map((catedra) => {
    const docente = catedra.docentes?.perfiles;
    return {
      id: catedra.id,
      codigo: catedra.codigo,
      modalidad: catedra.modalidad as TModalidadCurso,
      estado: catedra.estado as TEstadoCatedra,
      docente: docente ? `${docente.nombres} ${docente.apellidos}`.trim() : null,
    };
  });

  return {
    data: {
      id: data.id,
      nombre: data.nombre,
      descripcion: data.descripcion,
      resumen: data.resumen,
      nivel: data.nivel as TNivelCurso,
      modalidad: data.modalidad as TModalidadCurso,
      duracionSemanas: data.duracion_semanas,
      horasTotales: data.horas_totales,
      modulos,
      catedras,
    },
    error: null,
  };
}