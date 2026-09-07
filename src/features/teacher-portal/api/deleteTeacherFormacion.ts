import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function deleteTeacherFormacion(
  id: string
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const { error } = await supabase
    .from("docente_formacion")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
