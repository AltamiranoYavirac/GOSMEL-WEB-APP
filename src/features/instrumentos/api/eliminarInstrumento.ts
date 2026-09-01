import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function eliminarInstrumento(
  instrumentoId: string
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const { data: cursos } = await supabase
    .from("cursos")
    .select("id")
    .eq("instrumento_id", instrumentoId)
    .limit(1);

  if (cursos && cursos.length > 0) {
    return {
      error: "No se puede eliminar el instrumento porque hay cursos que lo utilizan. Desasocie los cursos o desactive el instrumento.",
    };
  }

  const { error } = await supabase.from("instrumentos").delete().eq("id", instrumentoId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
