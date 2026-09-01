import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { ICobranzaRow } from "../model/cobranza.types";

export async function getCobranza(): Promise<{
  data: ICobranzaRow[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();

  const [estudiantes, vinculos, representantes, acuerdos] = await Promise.all([
    supabase.from("estudiantes").select("id, perfil_id, nombres, apellidos").limit(2000),
    supabase.from("estudiante_representante").select("representante_id, estudiante_id").limit(2000),
    supabase.from("representantes").select("id, nombres, apellidos, celular").limit(1000),
    supabase
      .from("acuerdos_pago")
      .select(
        "estudiante_id, cuotas!cuotas_acuerdo_id_fkey(periodo_mes, monto, monto_pagado, fecha_vencimiento, estado)"
      )
      .limit(3000),
  ]);

  const firstError = [estudiantes, vinculos, representantes, acuerdos]
    .map((result) => result.error)
    .find(Boolean);
  if (firstError) {
    return { data: null, error: firstError.message };
  }

  const representanteIds = new Set((vinculos.data ?? []).map((vinculo) => vinculo.representante_id));
  const representantesRelevantes = (representantes.data ?? []).filter((representante) =>
    representanteIds.has(representante.id)
  );

  const hoy = new Date();
  const periodoActual = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}`;

  const estudiantesPorRepresentante = new Map<string, Set<string>>();
  for (const vinculo of vinculos.data ?? []) {
    const set = estudiantesPorRepresentante.get(vinculo.representante_id) ?? new Set();
    set.add(vinculo.estudiante_id);
    estudiantesPorRepresentante.set(vinculo.representante_id, set);
  }

  const cuotasPorEstudiante = new Map<
    string,
    Array<{ periodo: string; monto: number; montoPagado: number; vencimiento: string | null; estado: string }>
  >();
  for (const acuerdo of acuerdos.data ?? []) {
    const list = cuotasPorEstudiante.get(acuerdo.estudiante_id) ?? [];
    for (const cuota of acuerdo.cuotas ?? []) {
      list.push({
        periodo: cuota.periodo_mes,
        monto: Number(cuota.monto) || 0,
        montoPagado: Number(cuota.monto_pagado) || 0,
        vencimiento: cuota.fecha_vencimiento,
        estado: cuota.estado,
      });
    }
    cuotasPorEstudiante.set(acuerdo.estudiante_id, list);
  }

  const rows: ICobranzaRow[] = representantesRelevantes.map((representante) => {
    const estudiantesList = estudiantesPorRepresentante.get(representante.id) ?? new Set();
    let saldoTotal = 0;
    let totalMes = 0;
    let diasMoraMax: number | null = null;
    const estudiantesConCuota = new Set<string>();

    for (const estudianteId of estudiantesList) {
      const cuotas = cuotasPorEstudiante.get(estudianteId) ?? [];
      if (cuotas.length > 0) estudiantesConCuota.add(estudianteId);

      for (const cuota of cuotas) {
        if (cuota.estado !== "pendiente" && cuota.estado !== "parcial") continue;
        const saldo = cuota.monto - cuota.montoPagado;
        saldoTotal += saldo;
        if (cuota.periodo?.startsWith(periodoActual)) totalMes += saldo;

        if (cuota.vencimiento) {
          const vencimiento = new Date(`${cuota.vencimiento}T00:00:00`);
          const dias = Math.floor((hoy.getTime() - vencimiento.getTime()) / 86_400_000);
          if (dias > 0 && (diasMoraMax == null || dias > diasMoraMax)) diasMoraMax = dias;
        }
      }
    }

    return {
      id: representante.id,
      representante: `${representante.nombres} ${representante.apellidos}`.trim(),
      celular: representante.celular,
      hijosConCuota: estudiantesConCuota.size,
      saldoTotal,
      totalMes,
      diasMoraMax,
      periodoMes: `${periodoActual}-01`,
    };
  });

  return { data: rows, error: null };
}