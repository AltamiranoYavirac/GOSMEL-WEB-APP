import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { ICuotaRow, TEstadoCuota } from "../model/cuota.types";

export async function getCuotas(): Promise<{
  data: ICuotaRow[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("cuotas")
    .select(
      "id, periodo_mes, monto, monto_pagado, fecha_vencimiento, estado, acuerdo_id, acuerdos_pago!cuotas_acuerdo_id_fkey(estudiante_id, estudiantes!acuerdos_pago_estudiante_id_fkey(nombres, apellidos))"
    )
    .order("periodo_mes", { ascending: false })
    .limit(500);

  if (error) {
    return { data: null, error: error.message };
  }

  const rows: ICuotaRow[] = (data ?? []).map((cuota) => ({
    id: cuota.id,
    periodo: cuota.periodo_mes,
    estudiante: `${cuota.acuerdos_pago?.estudiantes?.nombres ?? ""} ${cuota.acuerdos_pago?.estudiantes?.apellidos ?? ""}`.trim(),
    monto: cuota.monto,
    montoPagado: cuota.monto_pagado,
    saldo: cuota.monto - cuota.monto_pagado,
    fechaVencimiento: cuota.fecha_vencimiento,
    estado: cuota.estado as TEstadoCuota,
  }));

  return { data: rows, error: null };
}