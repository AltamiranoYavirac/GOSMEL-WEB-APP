import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function desvincularRepresentante(estudianteId: string, representanteId: string): Promise<{ error: string | null }> {
  const { error } = await createSupabaseBrowserClient().rpc("desvincular_representante_estudiante", { p_estudiante_id: estudianteId, p_representante_id: representanteId });
  return { error: error?.message ?? null };
}
