import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IAcuerdoRow, TEstadoAcuerdo } from "../model/acuerdo.types";

export async function getAcuerdos(): Promise<{
  data: IAcuerdoRow[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("acuerdos_pago")
    .select(
      "id, monto_mensual, moneda, dia_cobro, fecha_inicio, fecha_fin, motivo_ajuste, observaciones, estado, estudiante_id, estudiantes!acuerdos_pago_estudiante_id_fkey(nombres, apellidos), inscripcion_id, inscripciones!acuerdos_pago_inscripcion_id_fkey(catedra_id, catedras!inscripciones_catedra_id_fkey(codigo, cursos(nombre)))"
    )
    .order("created_at", { ascending: false })
    .limit(300);

  if (error) {
    return { data: null, error: error.message };
  }

  const rows: IAcuerdoRow[] = (data ?? []).map((acuerdo) => {
    const catedra = acuerdo.inscripciones?.catedras;
    const inscripcion = catedra ? `${catedra.codigo} · ${catedra.cursos?.nombre ?? ""}`.trim() : null;

    return {
      id: acuerdo.id,
      estudiante: `${acuerdo.estudiantes?.nombres ?? ""} ${acuerdo.estudiantes?.apellidos ?? ""}`.trim(),
      montoMensual: Number(acuerdo.monto_mensual),
      moneda: acuerdo.moneda,
      diaCobro: acuerdo.dia_cobro,
      fechaInicio: acuerdo.fecha_inicio,
      fechaFin: acuerdo.fecha_fin,
      motivoAjuste: acuerdo.motivo_ajuste,
      observaciones: acuerdo.observaciones,
      inscripcion,
      estado: acuerdo.estado as TEstadoAcuerdo,
    };
  });

  return { data: rows, error: null };
}