import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function anularPago(
  pagoId: string
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const { data: pago, error: fetchError } = await supabase
    .from("pagos")
    .select("cuota_id, monto")
    .eq("id", pagoId)
    .single();

  if (fetchError || !pago) {
    return { error: fetchError?.message ?? "Pago no encontrado" };
  }

  const cuotaId = pago.cuota_id;

  const { error: deleteError } = await supabase.from("pagos").delete().eq("id", pagoId);
  if (deleteError) {
    return { error: deleteError.message };
  }

  if (cuotaId) {
    const { data: remainingPagos } = await supabase
      .from("pagos")
      .select("monto, fecha_pago")
      .eq("cuota_id", cuotaId)
      .order("fecha_pago", { ascending: false });

    const totalPagado = (remainingPagos ?? []).reduce((sum, p) => sum + Number(p.monto), 0);
    const lastFechaPago = remainingPagos && remainingPagos.length > 0 ? remainingPagos[0].fecha_pago : null;

    const { data: cuota } = await supabase.from("cuotas").select("monto").eq("id", cuotaId).single();
    const montoCuota = cuota?.monto ?? 0;

    const nuevoEstado: "pendiente" | "parcial" | "pagada" =
      totalPagado >= montoCuota
        ? "pagada"
        : totalPagado > 0
        ? "parcial"
        : "pendiente";

    await supabase
      .from("cuotas")
      .update({
        monto_pagado: totalPagado,
        estado: nuevoEstado,
        fecha_pago: lastFechaPago,
      })
      .eq("id", cuotaId);
  }

  return { error: null };
}
