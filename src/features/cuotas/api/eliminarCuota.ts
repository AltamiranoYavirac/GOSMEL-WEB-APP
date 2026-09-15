import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function eliminarCuota(
  cuotaId: string, motivo = "Sin motivo registrado"
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.rpc("anular_cuota", { p_cuota_id: cuotaId, p_motivo: motivo });
  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
