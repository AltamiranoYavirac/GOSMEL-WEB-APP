import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function rechazarPago(
  pagoId: string,
  observacion: string
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.rpc("revisar_cobro", { p_cobro_id: pagoId, p_aprobar: false, p_motivo: observacion.trim() });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: { id: pagoId }, error: null };
}
