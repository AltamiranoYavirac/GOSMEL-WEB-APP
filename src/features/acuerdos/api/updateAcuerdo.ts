import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IEditarAcuerdoFormValues } from "../model/EditarAcuerdoForm.config";

export async function updateAcuerdo(
  acuerdoId: string,
  values: IEditarAcuerdoFormValues
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const { data, error } = await supabase
    .from("acuerdos_pago")
    .update({
      monto_mensual: values.montoMensual,
      dia_cobro: values.diaCobro || null,
      fecha_fin: values.fechaFin || null,
      estado: values.estado,
      motivo_ajuste: values.motivoAjuste?.trim() || null,
      observaciones: values.observaciones?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", acuerdoId)
    .select("id")
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}
