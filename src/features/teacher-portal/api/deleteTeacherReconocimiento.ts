import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function deleteTeacherReconocimiento(
  id: string
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const { error } = await supabase
    .from("docente_reconocimientos")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
