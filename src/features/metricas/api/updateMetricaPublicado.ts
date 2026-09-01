import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function updateMetricaPublicado(
  id: string,
  publicado: boolean
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("metricas_academia")
    .update({ publicado })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}