import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function anularPago(pagoId: string, motivo = "Sin motivo registrado"): Promise<{ error: string | null }> {
  const { error } = await createSupabaseBrowserClient().rpc("anular_cobro", { p_cobro_id: pagoId, p_motivo: motivo });
  return { error: error?.message ?? null };
}
