import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function eliminarHorarioRecurrente(
  horarioId: string
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.from("catedra_horarios").delete().eq("id", horarioId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
