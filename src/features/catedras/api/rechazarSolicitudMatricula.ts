import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function rechazarSolicitudMatricula(
  inscripcionId: string
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const { error } = await supabase
    .from("inscripciones")
    .delete()
    .eq("id", inscripcionId)
    .eq("estado", "pendiente");

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
