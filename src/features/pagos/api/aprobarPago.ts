import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function aprobarPago(
  pagoId: string
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.rpc("revisar_cobro", { p_cobro_id: pagoId, p_aprobar: true, p_motivo: null } as never);

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: { id: pagoId }, error: null };
}
