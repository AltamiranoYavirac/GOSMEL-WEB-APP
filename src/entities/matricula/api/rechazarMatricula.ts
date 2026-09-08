import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function rechazarMatricula(
  inscripcionId: string,
  motivo: string
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const { error } = await supabase
    .from("inscripciones")
    .update({ estado: "cancelada", motivo_rechazo: motivo })
    .eq("id", inscripcionId)
    .eq("estado", "pendiente");

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
