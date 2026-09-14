import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/api/supabase/database.types";
import type { IPagoRow } from "../model/pago.types";

export async function getPagos(supabase: SupabaseClient<Database> = createSupabaseBrowserClient()): Promise<{ data: IPagoRow[] | null; error: string | null }> {
  const { data: cobros, error } = await supabase.from("cobros").select("id, fecha_pago, monto_total, metodo, referencia, observacion, comprobante_storage_path, numero_recibo, estado").order("fecha_pago", { ascending: false }).limit(300);
  if (error) return { data: null, error: error.message };
  const ids = (cobros ?? []).map((c) => c.id);
  const { data: aplicaciones, error: appError } = ids.length ? await supabase.from("cobro_aplicaciones").select("cobro_id, cuota_id").in("cobro_id", ids) : { data: [], error: null };
  if (appError) return { data: null, error: appError.message };
  const cuotaIds = [...new Set((aplicaciones ?? []).map((a) => a.cuota_id))];
  const { data: cuotas, error: cuotaError } = cuotaIds.length ? await supabase.from("v_estado_cuenta").select("cuota_id, estudiante, periodo_mes").in("cuota_id", cuotaIds) : { data: [], error: null };
  if (cuotaError) return { data: null, error: cuotaError.message };
  const porCuota = new Map((cuotas ?? []).map((c) => [c.cuota_id, c]));
  const porCobro = new Map<string, string[]>();
  for (const a of aplicaciones ?? []) porCobro.set(a.cobro_id, [...(porCobro.get(a.cobro_id) ?? []), a.cuota_id]);
  return { data: (cobros ?? []).map((c) => {
    const cuotaIdsCobro = porCobro.get(c.id) ?? []; const cuota = porCuota.get(cuotaIdsCobro[0]);
    return { id: c.id, fechaPago: c.fecha_pago, estudiante: cuotaIdsCobro.length > 1 ? `${cuota?.estudiante ?? "—"} y ${cuotaIdsCobro.length - 1} más` : cuota?.estudiante ?? "—", periodo: cuota?.periodo_mes ?? null, monto: Number(c.monto_total), metodo: c.metodo, referencia: c.referencia, observacion: c.observacion, comprobanteStoragePath: c.comprobante_storage_path, numeroRecibo: c.numero_recibo, estado: c.estado as IPagoRow["estado"] };
  }), error: null };
}
