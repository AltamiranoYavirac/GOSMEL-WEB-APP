import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const hoy = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("pagos")
    .insert({
      cuota_id: input.cuotaId,
      monto: input.values.monto,
      metodo: input.values.metodo,
      referencia: input.values.referencia?.trim() || null,
      comprobante_storage_path: input.values.comprobanteStoragePath?.trim() || null,
      observacion: input.values.observacion?.trim() || null,
      registrado_por: user?.id ?? null,
      fecha_pago: hoy,
    })
    .select("id")
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}