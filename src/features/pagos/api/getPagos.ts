import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IPagoRow } from "../model/pago.types";

export async function getPagos(): Promise<{
  data: IPagoRow[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("pagos")
    .select(
      "id, fecha_pago, monto, metodo, referencia, observacion, comprobante_storage_path, cuota_id, cuotas!pagos_cuota_id_fkey(periodo_mes, acuerdo_id, acuerdos_pago!cuotas_acuerdo_id_fkey(estudiante_id, estudiantes!acuerdos_pago_estudiante_id_fkey(nombres, apellidos)))"
    )
    .order("fecha_pago", { ascending: false })
    .limit(300);

  if (error) {
    return { data: null, error: error.message };
  }

  const rows: IPagoRow[] = (data ?? []).map((pago) => ({
    id: pago.id,
    fechaPago: pago.fecha_pago,
    estudiante: `${pago.cuotas?.acuerdos_pago?.estudiantes?.nombres ?? ""} ${pago.cuotas?.acuerdos_pago?.estudiantes?.apellidos ?? ""}`.trim(),
    periodo: pago.cuotas?.periodo_mes ?? null,
    monto: Number(pago.monto),
    metodo: pago.metodo,
    referencia: pago.referencia,
    observacion: pago.observacion,
    comprobanteStoragePath: pago.comprobante_storage_path,
  }));

  return { data: rows, error: null };
}