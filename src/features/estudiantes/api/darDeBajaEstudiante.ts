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

  const { error: rpcError } = await supabase.rpc("dar_de_baja_estudiante", {
    p_inscripcion_id: input.inscripcionId,
    p_motivo: input.motivo || "Retiro tramitado por administración",
    p_condonar_cuotas_pendientes: Boolean(input.condonarCuotasPendientes),
  });

  if (rpcError) {
    return { error: rpcError.message };
  }

  return { error: null };
}