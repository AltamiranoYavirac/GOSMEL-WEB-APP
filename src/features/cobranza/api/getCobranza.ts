import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/api/supabase/database.types";
import type { ICobranzaRow } from "../model/cobranza.types";

export async function getCobranza(supabase: SupabaseClient<Database> = createSupabaseBrowserClient()): Promise<{ data: ICobranzaRow[] | null; error: string | null }> {
  const { data, error } = await supabase.from("v_cobranza_responsables").select("*").order("saldo_total", { ascending: false });
  if (error) return { data: null, error: error.message };
  const periodoMes = `${new Date().toISOString().slice(0, 7)}-01`;
  return { data: (data ?? []).map((r) => ({
    id: r.responsable_id ?? "", representante: r.responsable ?? "Sin responsable", celular: r.celular,
    hijosConCuota: Number(r.estudiantes_con_cargo ?? 0), saldoTotal: Number(r.saldo_total ?? 0), totalMes: Number(r.saldo_mes ?? 0), diasMoraMax: r.dias_mora_max, periodoMes,
    responsableTipo: r.responsable_tipo === "estudiante" ? "estudiante" : "representante",
  })), error: null };
}
