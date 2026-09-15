import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { Database } from "@/shared/api/supabase/database.types";

import type { IRegistrarPagoFormValues } from "../model/RegistrarPagoForm.config";

export async function registrarPago(
  cuotaId: string,
  values: IRegistrarPagoFormValues
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const { data: cuota, error: cuotaError } = await supabase
    .from("cuotas")
    .select("estudiante_id, responsable_representante_id")
    .eq("id", cuotaId)
    .single();
  if (cuotaError || !cuota) return { data: null, error: cuotaError?.message ?? "Cuota no encontrada" };

  const { data, error } = await supabase.rpc("registrar_cobro", {
    p_responsable_representante_id: cuota.responsable_representante_id,
    p_responsable_estudiante_id: cuota.responsable_representante_id ? null : cuota.estudiante_id,
    p_fecha_pago: values.fechaPago,
    p_metodo: values.metodo as Database["public"]["Enums"]["metodo_cobro"],
    p_referencia: values.referencia?.trim() || null,
    p_comprobante_storage_path: null,
    p_observacion: values.observacion?.trim() || null,
    p_origen: "admin",
    p_aplicaciones: [{ cuota_id: cuotaId, monto: values.monto }],
  } as never);
  return error ? { data: null, error: error.message } : { data: { id: data as string }, error: null };
}
