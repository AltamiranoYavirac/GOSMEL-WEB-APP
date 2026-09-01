import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export interface IInscribirEstudianteCatedraInput {
  estudianteId: string;
  catedraId: string;
  montoMensual?: number;
  diaCobro?: number;
  motivoAjuste?: string;
  montoPrimerMes?: number;
}

export async function inscribirEstudianteCatedra(input: IInscribirEstudianteCatedraInput): Promise<{
  data: { inscripcionId: string } | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();

  const { data: rpcData, error: rpcError } = await supabase.rpc("matricular_estudiante_directo" as any, {
    p_estudiante_id: input.estudianteId,
    p_catedra_id: input.catedraId,
    p_monto_mensual: input.montoMensual ?? 0,
    p_dia_cobro: input.diaCobro ?? 5,
    p_motivo_ajuste: input.motivoAjuste?.trim() || null,
    p_monto_primer_mes: input.montoPrimerMes || null,
  });

  if (!rpcError && rpcData) {
    return { data: { inscripcionId: String(rpcData) }, error: null };
  }

  if (rpcError && !rpcError.message.includes("Could not find the function")) {
    return { data: null, error: rpcError.message };
  }

  const { data: existing } = await supabase
    .from("inscripciones")
    .select("id")
    .eq("estudiante_id", input.estudianteId)
    .eq("catedra_id", input.catedraId)
    .in("estado", ["activa", "pendiente"])
    .maybeSingle();

  if (existing) {
    return { data: null, error: "El estudiante ya tiene una matrícula activa o pendiente en esta cátedra." };
  }

  const { data: userData } = await supabase.auth.getUser();
  const currentUid = userData?.user?.id;
  const today = new Date().toISOString().slice(0, 10);

  const { data: inscripcion, error: inscError } = await supabase
    .from("inscripciones")
    .insert({
      estudiante_id: input.estudianteId,
      catedra_id: input.catedraId,
      estado: "activa",
      fecha_inscripcion: today,
      aprobada_por: currentUid || null,
      aprobada_en: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (inscError || !inscripcion) {
    return { data: null, error: inscError?.message ?? "Error al crear la inscripción" };
  }

  const monto = input.montoMensual ?? 0;
  if (monto > 0) {
    const diaCobro = input.diaCobro ?? 5;
    const { data: acuerdo } = await supabase
      .from("acuerdos_pago")
      .insert({
        estudiante_id: input.estudianteId,
        inscripcion_id: inscripcion.id,
        monto_mensual: monto,
        dia_cobro: diaCobro,
        motivo_ajuste: input.motivoAjuste?.trim() || null,
        acordado_por: currentUid || null,
      })
      .select("id")
      .single();

    if (acuerdo) {
      const now = new Date();
      const mesActual = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
      const vencimientoDate = new Date(now.getFullYear(), now.getMonth(), diaCobro);
      const vencimientoStr = vencimientoDate < now
        ? new Date(now.getTime() + 3 * 86400000).toISOString().slice(0, 10)
        : vencimientoDate.toISOString().slice(0, 10);

      await supabase.from("cuotas").insert({
        acuerdo_id: acuerdo.id,
        periodo_mes: mesActual,
        monto: input.montoPrimerMes ?? monto,
        fecha_vencimiento: vencimientoStr,
      });
    }
  }

  return { data: { inscripcionId: inscripcion.id }, error: null };
}
