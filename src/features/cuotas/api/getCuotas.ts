import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/api/supabase/database.types";

import type { ICuotaRow, TEstadoCuota } from "../model/cuota.types";

export async function getCuotas(
  supabase: SupabaseClient<Database> = createSupabaseBrowserClient(),
): Promise<{
  data: ICuotaRow[] | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("v_estado_cuenta")
    .select(
      "cuota_id, periodo_mes, estudiante, monto, monto_pagado, saldo, saldo_reservado, fecha_vencimiento, estado"
    )
    .order("periodo_mes", { ascending: false })
    .limit(500);

  if (error) {
    return { data: null, error: error.message };
  }

  const rows: ICuotaRow[] = (data ?? []).map((cuota) => ({
    id: cuota.cuota_id ?? "",
    periodo: cuota.periodo_mes ?? "",
    estudiante: cuota.estudiante ?? "Estudiante",
    monto: Number(cuota.monto) || 0,
    montoPagado: Number(cuota.monto_pagado) || 0,
    saldo: Number(cuota.saldo) || 0,
    saldoReservado: Number(cuota.saldo_reservado) || 0,
    fechaVencimiento: cuota.fecha_vencimiento,
    estado: cuota.estado as TEstadoCuota,
  }));

  return { data: rows, error: null };
}
