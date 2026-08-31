import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function eliminarEvaluacion(
  evaluacionId: string
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.from("evaluaciones").delete().eq("id", evaluacionId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
