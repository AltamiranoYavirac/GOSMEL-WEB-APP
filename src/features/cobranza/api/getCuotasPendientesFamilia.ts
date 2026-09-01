import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export interface ICuotaPendienteItem {
  cuotaId: string;
  estudianteId: string;
  estudianteNombre: string;
  periodoMes: string;
  monto: number;
  montoPagado: number;
  saldo: number;
  fechaVencimiento: string | null;
}

export async function getCuotasPendientesFamilia(representanteId: string): Promise<{
  data: ICuotaPendienteItem[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();

  const { data: vinculos, error: vincError } = await supabase
    .from("estudiante_representante")
    .select("estudiante_id")
    .eq("representante_id", representanteId);

  if (vincError) {
    return { data: null, error: vincError.message };
  }

  const studentIds = (vinculos ?? []).map((v) => v.estudiante_id);
  if (studentIds.length === 0) {
    return { data: [], error: null };
  }

  const { data: viewData, error: viewError } = await supabase
    .from("v_estado_cuenta")
    .select("cuota_id, estudiante_id, estudiante, periodo_mes, monto, monto_pagado, saldo, fecha_vencimiento, estado_efectivo")
    .in("estudiante_id", studentIds)
    .in("estado_efectivo", ["pendiente", "parcial", "vencida"])
    .order("periodo_mes", { ascending: true });

  if (!viewError && viewData && viewData.length >= 0) {
    const items: ICuotaPendienteItem[] = (viewData)
      .filter((row) => Boolean(row.cuota_id && row.estudiante_id))
      .map((row) => ({
        cuotaId: row.cuota_id!,
        estudianteId: row.estudiante_id!,
        estudianteNombre: row.estudiante ?? "Estudiante",
        periodoMes: row.periodo_mes ?? "",
        monto: Number(row.monto) || 0,
        montoPagado: Number(row.monto_pagado) || 0,
        saldo: Number(row.saldo) || 0,
        fechaVencimiento: row.fecha_vencimiento,
      }));

    return { data: items, error: null };
  }

  const { data: directData, error: directError } = await supabase
    .from("cuotas")
    .select(`
      id,
      monto,
      monto_pagado,
      fecha_vencimiento,
      estado,
      periodo_mes,
      acuerdos_pago!cuotas_acuerdo_id_fkey(
        estudiante_id,
        estudiantes!acuerdos_pago_estudiante_id_fkey(id, nombres, apellidos)
      )
    `)
    .in("estado", ["pendiente", "parcial"])
    .order("periodo_mes", { ascending: true });

  if (directError) {
    return { data: null, error: directError.message };
  }

  const studentSet = new Set(studentIds);
  const items: ICuotaPendienteItem[] = [];

  for (const row of directData ?? []) {
    const estId = row.acuerdos_pago?.estudiante_id;
    if (estId && studentSet.has(estId)) {
      const monto = Number(row.monto) || 0;
      const pagado = Number(row.monto_pagado) || 0;
      const saldo = monto - pagado;
      const est = row.acuerdos_pago?.estudiantes;
      const nombre = est ? `${est.nombres} ${est.apellidos}`.trim() : "Estudiante";

      if (saldo > 0) {
        items.push({
          cuotaId: row.id,
          estudianteId: estId,
          estudianteNombre: nombre,
          periodoMes: row.periodo_mes,
          monto,
          montoPagado: pagado,
          saldo,
          fechaVencimiento: row.fecha_vencimiento,
        });
      }
    }
  }

  return { data: items, error: null };
}
