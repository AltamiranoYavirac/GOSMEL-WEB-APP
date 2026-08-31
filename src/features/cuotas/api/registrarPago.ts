import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { TablesInsert } from "@/shared/api/supabase/database.types";

import type { IRegistrarPagoFormValues } from "../model/RegistrarPagoForm.config";

export async function registrarPago(
  cuotaId: string,
  values: IRegistrarPagoFormValues
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pago: TablesInsert<"pagos"> = {
    cuota_id: cuotaId,
    monto: values.monto,
    metodo: values.metodo,
    fecha_pago: values.fechaPago,
    registrado_por: user?.id ?? null,
  };

  if (values.referencia?.trim()) pago.referencia = values.referencia.trim();
  if (values.observacion?.trim()) pago.observacion = values.observacion.trim();

  const { data, error } = await supabase.from("pagos").insert(pago).select("id").single();
  if (error) {
    return { data: null, error: error.message };
  }

  const { data: pagos } = await supabase.from("pagos").select("monto").eq("cuota_id", cuotaId);
  const totalPagado = (pagos ?? []).reduce((suma, item) => suma + Number(item.monto), 0);

  const { data: cuota } = await supabase.from("cuotas").select("monto").eq("id", cuotaId).single();
  const montoCuota = cuota?.monto ?? 0;
  const estado: "pagada" | "parcial" = totalPagado >= montoCuota ? "pagada" : "parcial";

  const { error: cuotaError } = await supabase
    .from("cuotas")
    .update({ monto_pagado: totalPagado, estado, fecha_pago: values.fechaPago })
    .eq("id", cuotaId);

  if (cuotaError) {
    return { data: null, error: cuotaError.message };
  }

  return { data, error: null };
}