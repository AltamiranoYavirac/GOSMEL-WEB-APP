import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function eliminarCuota(
  cuotaId: string
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const { data: cuota, error: fetchError } = await supabase
    .from("cuotas")
    .select("monto_pagado")
    .eq("id", cuotaId)
    .single();

  if (fetchError || !cuota) {
    return { error: fetchError?.message ?? "Cuota no encontrada" };
  }

  if (Number(cuota.monto_pagado) > 0) {
    return {
      error: "No se puede eliminar una cuota que registra pagos asociados. Debe anular los pagos primero.",
    };
  }

  const { error } = await supabase.from("cuotas").delete().eq("id", cuotaId);
  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
