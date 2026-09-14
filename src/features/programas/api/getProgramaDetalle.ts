import type { SupabaseClient } from "@supabase/supabase-js";

import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { Database } from "@/shared/api/supabase/database.types";

import type { IProgramaDetalle, TNivelCurso } from "../model/programa-detalle.types";

export async function getProgramaDetalle(
  programaId: string,
  supabase: SupabaseClient<Database> = createSupabaseBrowserClient(),
): Promise<{ data: IProgramaDetalle | null; error: string | null }> {
  const { data, error } = await supabase
    .from("programas")
    .select(
      "id, nombre, slug, descripcion, nivel, imagen_public_id, imagen_texto_alt, precio_referencial, etiqueta_precio, mostrar_precio, publicado, orden, programa_curso(orden, cursos(id, nombre, nivel, modalidad)), programa_objetivos(id, objetivo, orden)"
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
      objetivos: (data.programa_objetivos ?? [])
        .slice()
        .sort((a, b) => a.orden - b.orden)
        .map((item) => ({ id: item.id, objetivo: item.objetivo, orden: item.orden })),
      nivel: data.nivel as TNivelCurso | null,
      imagenPublicId: data.imagen_public_id,
      imagenTextoAlt: data.imagen_texto_alt,
      precioReferencial: data.precio_referencial === null ? null : String(data.precio_referencial),
      etiquetaPrecio: data.etiqueta_precio,
      mostrarPrecio: data.mostrar_precio,
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

export async function updateOrdenCursoPrograma(
  programaId: string,
  cursoId: string,
  orden: number
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase
    .from("programa_curso")
    .update({ orden })
    .eq("programa_id", programaId)
    .eq("curso_id", cursoId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
