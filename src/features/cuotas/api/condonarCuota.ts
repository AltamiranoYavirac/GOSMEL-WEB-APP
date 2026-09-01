import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function condonarCuota(
  cuotaId: string
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase
    .from("cuotas")
    .update({ estado: "condonada" })
    .eq("id", cuotaId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
