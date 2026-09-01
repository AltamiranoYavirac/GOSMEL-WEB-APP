import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export interface IAprobarMatriculaPayload {
  p_inscripcion_id: string;
  p_monto_mensual: number;
  p_dia_cobro: number;
  p_motivo_ajuste?: string;
  p_monto_primer_mes?: number;
}

export async function aprobarMatricula(
  payload: IAprobarMatriculaPayload
): Promise<{ data: boolean | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.rpc("aprobar_matricula" as any, payload);

  if (!error) {
    return { data: true, error: null };
  }

  if (error && !error.message.includes("Could not find the function")) {
    return { data: null, error: error.message };
  }

  const { data: userData } = await supabase.auth.getUser();
  const currentUid = userData?.user?.id;

  const { data: inscripcion, error: inscError } = await supabase
    .from("inscripciones")
    .update({
      estado: "activa",
      aprobada_por: currentUid || null,
      aprobada_en: new Date().toISOString(),
    })
    .eq("id", payload.p_inscripcion_id)
    .select("id, estudiante_id")
    .single();

  if (inscError || !inscripcion) {
    return { data: null, error: inscError?.message ?? "Error al actualizar inscripción" };
  }

  const { data: acuerdo } = await supabase
    .from("acuerdos_pago")
    .insert({
      estudiante_id: inscripcion.estudiante_id,
      inscripcion_id: inscripcion.id,
      monto_mensual: payload.p_monto_mensual,
      dia_cobro: payload.p_dia_cobro ?? 5,
      motivo_ajuste: payload.p_motivo_ajuste?.trim() || null,
      acordado_por: currentUid || null,
    })
    .select("id")
    .single();

  if (acuerdo) {
    const now = new Date();
    const mesActual = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
    const vencimientoDate = new Date(now.getFullYear(), now.getMonth(), payload.p_dia_cobro ?? 5);
    const vencimientoStr = vencimientoDate < now
      ? new Date(now.getTime() + 3 * 86400000).toISOString().slice(0, 10)
      : vencimientoDate.toISOString().slice(0, 10);

    await supabase.from("cuotas").insert({
      acuerdo_id: acuerdo.id,
      periodo_mes: mesActual,
      monto: payload.p_monto_primer_mes ?? payload.p_monto_mensual,
      fecha_vencimiento: vencimientoStr,
    });
  }

  return { data: true, error: null };
}