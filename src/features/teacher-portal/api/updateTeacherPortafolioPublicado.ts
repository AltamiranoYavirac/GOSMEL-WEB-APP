import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function updateTeacherPortafolioPublicado(
  portafolioId: string,
  publicado: boolean
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const { error } = await supabase
    .from("docente_portafolio")
    .update({ publicado })
    .eq("id", portafolioId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
