import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IEditarAcuerdoFormValues } from "../model/EditarAcuerdoForm.config";

export async function updateAcuerdo(
  acuerdoId: string,
  values: IEditarAcuerdoFormValues
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const { error } = await supabase.rpc("actualizar_acuerdo_completo" as never, {
    p_acuerdo_id: acuerdoId,
    p_monto_mensual: values.montoMensual,
    p_dia_cobro: values.diaCobro ?? 5,
    p_vigente_desde: values.vigenteDesde,
    p_estado: values.estado,
    p_fecha_fin: values.fechaFin || null,
    p_motivo: values.motivoAjuste?.trim() || null,
    p_observaciones: values.observaciones?.trim() || null,
  } as never);
  return error ? { data: null, error: error.message } : { data: { id: acuerdoId }, error: null };
}
