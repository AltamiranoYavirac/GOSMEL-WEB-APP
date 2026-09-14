import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import {
  buildProgramaUpdatePayload,
  type IProgramaFormValues,
} from "../model/ProgramaForm.config";

export async function updatePrograma(
  programaId: string,
  values: IProgramaFormValues,
  imagenPublicId: string | null = values.quitarImagen ? null : values.imagenPublicId || null
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("programas")
    .update(buildProgramaUpdatePayload(values, imagenPublicId))
    .eq("id", programaId)
    .select("id")
    .single();

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}
