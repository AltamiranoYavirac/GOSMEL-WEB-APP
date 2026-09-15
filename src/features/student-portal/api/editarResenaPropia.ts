import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { ICrearResenaFormValues } from "../model/CrearResenaForm.config";

export async function editarResenaPropia(
  resenaId: string,
  values: ICrearResenaFormValues
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.rpc("editar_resena_propia", {
    p_resena_id: resenaId,
    p_puntuacion: values.puntuacion,
    p_comentario: values.comentario?.trim() || "",
  });

  return { error: error?.message ?? null };
}
