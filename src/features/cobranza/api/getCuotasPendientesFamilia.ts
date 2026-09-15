import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/api/supabase/database.types";

export interface ICuotaPendienteItem {
  cuotaId: string;
  estudianteId: string;
  estudianteNombre: string;
  periodoMes: string;
  monto: number;
  montoPagado: number;
  saldo: number;
  saldoReservado: number;
  fechaVencimiento: string | null;
}

/** Incluye al estudiante adulto que es responsable de sí mismo. */
export async function getCuotasPendientesFamilia(
  responsableId: string,
  responsableTipoOrSupabase: "representante" | "estudiante" | SupabaseClient<Database> = "representante",
  providedSupabase?: SupabaseClient<Database>,
): Promise<{ data: ICuotaPendienteItem[] | null; error: string | null }> {
  const responsableTipo = typeof responsableTipoOrSupabase === "string"
    ? responsableTipoOrSupabase
    : "representante";
  const supabase = typeof responsableTipoOrSupabase === "string"
    ? (providedSupabase ?? createSupabaseBrowserClient())
    : responsableTipoOrSupabase;
  let query = supabase
    .from("v_estado_cuenta")
    .select("cuota_id, estudiante_id, estudiante, periodo_mes, monto, monto_pagado, saldo, saldo_reservado, fecha_vencimiento, estado_efectivo")
    .in("estado_efectivo", ["pendiente", "parcial", "vencida"])
    .order("periodo_mes", { ascending: true });

  query = responsableTipo === "representante"
    ? query.eq("responsable_representante_id", responsableId)
    : query.eq("estudiante_id", responsableId).is("responsable_representante_id", null);

  const { data, error } = await query;
  if (error) return { data: null, error: error.message };

  return {
    data: (data ?? [])
      .filter((row) => Boolean(row.cuota_id && row.estudiante_id))
      .map((row) => ({
        cuotaId: row.cuota_id!,
        estudianteId: row.estudiante_id!,
        estudianteNombre: row.estudiante ?? "Estudiante",
        periodoMes: row.periodo_mes ?? "",
        monto: Number(row.monto) || 0,
        montoPagado: Number(row.monto_pagado) || 0,
        saldo: Number(row.saldo) || 0,
        saldoReservado: Number(row.saldo_reservado) || 0,
        fechaVencimiento: row.fecha_vencimiento,
      })),
    error: null,
  };
}
