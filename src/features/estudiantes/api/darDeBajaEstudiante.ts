import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export interface IDarDeBajaEstudianteInput {
  inscripcionId: string;
  motivo?: string;
  condonarCuotasPendientes?: boolean;
}

export async function darDeBajaEstudiante(input: IDarDeBajaEstudianteInput): Promise<{
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();

  const { error: rpcError } = await supabase.rpc("dar_de_baja_estudiante" as any, {
    p_inscripcion_id: input.inscripcionId,
    p_motivo: input.motivo || "Retiro tramitado por administración",
    p_condonar_cuotas_pendientes: Boolean(input.condonarCuotasPendientes),
  });

  if (!rpcError) {
    return { error: null };
  }

  if (rpcError && !rpcError.message.includes("Could not find the function")) {
    return { error: rpcError.message };
  }

  const { error: inscError } = await supabase
    .from("inscripciones")
    .update({
      estado: "retirada",
    })
    .eq("id", input.inscripcionId);

  if (inscError) {
    return { error: inscError.message };
  }

  const { data: acuerdo } = await supabase
    .from("acuerdos_pago")
    .select("id")
    .eq("inscripcion_id", input.inscripcionId)
    .maybeSingle();

  if (acuerdo) {
    await supabase
      .from("acuerdos_pago")
      .update({
        estado: "finalizado",
      })
      .eq("id", acuerdo.id);

    if (input.condonarCuotasPendientes) {
      await supabase
        .from("cuotas")
        .update({
          estado: "condonada",
        })
        .eq("acuerdo_id", acuerdo.id)
        .in("estado", ["pendiente", "parcial"]);
    }
  }

  return { error: null };
}
