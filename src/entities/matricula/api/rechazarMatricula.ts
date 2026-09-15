import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function rechazarMatricula(
  inscripcionId: string,
  motivo: string
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const { error } = await supabase.rpc("rechazar_matricula", {
    p_inscripcion_id: inscripcionId,
    p_motivo: motivo,
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
