import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function eliminarMetrica(id: string): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.from("metricas_academia").delete().eq("id", id);
  return { error: error?.message ?? null };
}
