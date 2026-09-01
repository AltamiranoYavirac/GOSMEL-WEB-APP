import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function eliminarAcuerdo(
  acuerdoId: string
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const { data: cuotas, error: cuotasError } = await supabase
    .from("cuotas")
    .select("id, monto_pagado")
    .eq("acuerdo_id", acuerdoId);

  if (cuotasError) {
    return { error: cuotasError.message };
  }

  const conPagos = (cuotas ?? []).some((c) => Number(c.monto_pagado) > 0);
  if (conPagos) {
    return {
      error:
        "No se puede eliminar un acuerdo que ya registra cuotas con pagos abonados para preservar el historial contable. Puede cambiar su estado a «Finalizado» o «Suspendido».",
    };
  }

  if (cuotas && cuotas.length > 0) {
    const cuotaIds = cuotas.map((c) => c.id);
    await supabase.from("cuotas").delete().in("id", cuotaIds);
  }

  const { error: deleteError } = await supabase
    .from("acuerdos_pago")
    .delete()
    .eq("id", acuerdoId);

  if (deleteError) {
    return { error: deleteError.message };
  }

  return { error: null };
}
