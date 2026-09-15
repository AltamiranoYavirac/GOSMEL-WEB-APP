import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { Database } from "@/shared/api/supabase/database.types";

import type { IReportarPagoFormValues } from "../model/ReportarPagoForm.config";

export interface IReportStudentPaymentInput {
  cuotaId: string;
  values: IReportarPagoFormValues;
}

export async function reportStudentPayment(input: IReportStudentPaymentInput): Promise<{
  data: { id: string } | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const hoy = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase.rpc("reportar_cobro_portal", {
    p_cuota_id: input.cuotaId,
    p_monto: input.values.monto,
    p_fecha_pago: hoy,
    p_metodo: input.values.metodo as Database["public"]["Enums"]["metodo_cobro"],
    p_referencia: input.values.referencia?.trim() || null,
    p_comprobante_storage_path: input.values.comprobanteStoragePath?.trim() || "",
    p_observacion: input.values.observacion?.trim() || null,
  } as never);
  return error ? { data: null, error: error.message } : { data: { id: data as string }, error: null };
}
