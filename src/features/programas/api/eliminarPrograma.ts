import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function eliminarPrograma(
  programaId: string
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.from("programas").delete().eq("id", programaId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
