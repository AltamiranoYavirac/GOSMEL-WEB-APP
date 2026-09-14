import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export interface ICuotaParaCierre { id: string; periodo: string; monto: number; montoPagado: number; estado: string }

export async function getCuotasParaCierre(acuerdoId: string): Promise<{ data: ICuotaParaCierre[] | null; error: string | null }> {
  const { data, error } = await createSupabaseBrowserClient().from("cuotas")
    .select("id, periodo_mes, monto, monto_pagado, estado").eq("acuerdo_id", acuerdoId)
    .in("estado", ["pendiente", "parcial"]).order("periodo_mes");
  if (error) return { data: null, error: error.message };
  return { data: (data ?? []).map((c) => ({ id: c.id, periodo: c.periodo_mes, monto: Number(c.monto), montoPagado: Number(c.monto_pagado), estado: c.estado })), error: null };
}
