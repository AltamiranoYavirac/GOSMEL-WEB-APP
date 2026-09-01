import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function eliminarMaterial(
  materialId: string
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.from("materiales").delete().eq("id", materialId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
