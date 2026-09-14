import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function eliminarTestimonio(id: string): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.from("testimonios").delete().eq("id", id);
  return { error: error?.message ?? null };
}
