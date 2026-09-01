import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IProgramaDetalle, TNivelCurso } from "../model/programa-detalle.types";

export async function getProgramaDetalle(
  programaId: string
): Promise<{ data: IProgramaDetalle | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("programas")
    .select(
      "id, nombre, slug, descripcion, objetivos, instrumento_id, nivel, publicado, orden, instrumentos(nombre), programa_curso(orden, cursos(id, nombre, nivel, modalidad))"
    )
    .eq("id", programaId)
    .maybeSingle();

  if (error) {
    return { data: null, error: error.message };
  }

  if (!data) {
    return { data: null, error: null };
  }

  const cursos = (data.programa_curso ?? [])
    .slice()
    .sort((a, b) => a.orden - b.orden)
    .map((item) => ({
      cursoId: item.cursos?.id ?? "",
      nombre: item.cursos?.nombre ?? "",
      nivel: item.cursos?.nivel ?? "",
      modalidad: item.cursos?.modalidad ?? "",
      orden: item.orden,
    }))
    .filter((item) => !!item.cursoId);

  return {
    data: {
      id: data.id,
      nombre: data.nombre,
      slug: data.slug,
      descripcion: data.descripcion,
      objetivos: data.objetivos,
      instrumentoId: data.instrumento_id,
      instrumento: data.instrumentos?.nombre ?? null,
      nivel: data.nivel as TNivelCurso | null,
      publicado: data.publicado,
      orden: data.orden,
      cursos,
    },
    error: null,
  };
}

export async function asociarCursoPrograma(
  programaId: string,
  cursoId: string,
  orden = 0
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase
    .from("programa_curso")
    .insert({
      programa_id: programaId,
      curso_id: cursoId,
      orden,
    });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function desasociarCursoPrograma(
  programaId: string,
  cursoId: string
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase
    .from("programa_curso")
    .delete()
    .eq("programa_id", programaId)
    .eq("curso_id", cursoId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
