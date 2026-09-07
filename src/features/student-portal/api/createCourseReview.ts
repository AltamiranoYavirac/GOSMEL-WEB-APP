import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { ICrearResenaFormValues } from "../model/CrearResenaForm.config";

export async function createCourseReview(
  estudianteId: string,
  values: ICrearResenaFormValues
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const { data, error } = await supabase
    .from("curso_resenas")
    .insert({
      curso_id: values.cursoId,
      estudiante_id: estudianteId,
      puntuacion: values.puntuacion,
      comentario: values.comentario?.trim() || null,
      publicado: false,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { data: null, error: "Ya valoraste este curso" };
    }
    return { data: null, error: error.message };
  }

  return { data, error: null };
}