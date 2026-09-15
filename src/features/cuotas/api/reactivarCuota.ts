import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function reactivarCuota(
  cuotaId: string, motivo = "Restauración administrativa"
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const { error } = await supabase.rpc("restaurar_cuota_condonada" as never, { p_cuota_id: cuotaId, p_motivo: motivo } as never);
  return { error: error?.message ?? null };
}
