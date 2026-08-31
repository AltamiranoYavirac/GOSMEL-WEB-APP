import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export interface IAprobarMatriculaPayload {
  p_inscripcion_id: string;
  p_monto_mensual: number;
  p_dia_cobro: number;
  p_motivo_ajuste?: string;
}

export async function aprobarMatricula(
  payload: IAprobarMatriculaPayload
): Promise<{ data: boolean | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.rpc("aprobar_matricula", payload);

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}