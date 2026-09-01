import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export interface ICrearCuotaInput {
  estudianteId: string;
  monto: number;
  periodo: string;
  fechaVencimiento: string;
}

export async function crearCuota(
  input: ICrearCuotaInput
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const formattedPeriodo = input.periodo.length === 7 ? `${input.periodo}-01` : input.periodo;

  const { data: acuerdoExistente } = await supabase
    .from("acuerdos_pago")
    .select("id")
    .eq("estudiante_id", input.estudianteId)
    .eq("estado", "vigente")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let acuerdoId = acuerdoExistente?.id;

  if (!acuerdoId) {
    const { data: userData } = await supabase.auth.getUser();
    const { data: nuevoAcuerdo, error: acuerdoError } = await supabase
      .from("acuerdos_pago")
      .insert({
        estudiante_id: input.estudianteId,
        monto_mensual: input.monto,
        dia_cobro: 5,
        estado: "vigente",
        motivo_ajuste: "Cuota manual / extraordinaria",
        acordado_por: userData?.user?.id || null,
      })
      .select("id")
      .single();

    if (acuerdoError || !nuevoAcuerdo) {
      return { data: null, error: acuerdoError?.message ?? "Error al vincular acuerdo de pago" };
    }
    acuerdoId = nuevoAcuerdo.id;
  }

  const { data: cuota, error: cuotaError } = await supabase
    .from("cuotas")
    .insert({
      acuerdo_id: acuerdoId,
      periodo_mes: formattedPeriodo,
      monto: input.monto,
      monto_pagado: 0,
      estado: "pendiente",
      fecha_vencimiento: input.fechaVencimiento,
    })
    .select("id")
    .single();

  if (cuotaError) {
    return { data: null, error: cuotaError.message };
  }

  return { data: cuota, error: null };
}
