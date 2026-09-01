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
  const { error } = await supabase.rpc("aprobar_matricula", payload);

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: true, error: null };
}