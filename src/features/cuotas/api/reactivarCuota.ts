import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function reactivarCuota(
  cuotaId: string
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const { data: pagos, error: pagosError } = await supabase
    .from("pagos")
    .select("monto")
    .eq("cuota_id", cuotaId);

  if (pagosError) {
    return { error: pagosError.message };
  }

  const { data: cuota, error: cuotaError } = await supabase
    .from("cuotas")
    .select("monto")
    .eq("id", cuotaId)
    .single();

  if (cuotaError || !cuota) {
    return { error: cuotaError?.message ?? "Cuota no encontrada" };
  }

  const totalPagado = (pagos ?? []).reduce((suma, p) => suma + Number(p.monto), 0);
  const estado: "pendiente" | "parcial" | "pagada" =
    totalPagado >= cuota.monto
      ? "pagada"
      : totalPagado > 0
      ? "parcial"
      : "pendiente";

  const { error } = await supabase
    .from("cuotas")
    .update({
      estado,
      monto_pagado: totalPagado,
    })
    .eq("id", cuotaId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
