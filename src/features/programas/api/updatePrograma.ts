import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IProgramaFormValues } from "../model/ProgramaForm.config";

export async function updatePrograma(
  programaId: string,
  values: IProgramaFormValues
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("programas")
    .update({
      nombre: values.nombre.trim(),
      descripcion: values.descripcion?.trim() || null,
      objetivos: values.objetivos?.trim() || null,
      instrumento_id: values.instrumentoId || null,
      nivel: values.nivel || null,
      publicado: values.publicado,
      orden: values.orden,
    })
    .eq("id", programaId)
    .select("id")
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}
