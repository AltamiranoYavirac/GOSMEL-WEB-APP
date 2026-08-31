import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function eliminarLeccion(
  leccionId: string
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.from("curso_lecciones").delete().eq("id", leccionId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
