import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function retirarResenaPropia(resenaId: string): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.rpc("retirar_resena_propia", { p_resena_id: resenaId });

  return { error: error?.message ?? null };
}
