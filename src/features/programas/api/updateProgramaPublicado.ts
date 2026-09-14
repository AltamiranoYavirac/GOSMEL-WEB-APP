import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function updateProgramaPublicado(
  id: string,
  publicado: boolean
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  if (publicado) {
    const { data: programa, error: readError } = await supabase
      .from("programas")
      .select("imagen_public_id, mostrar_precio, etiqueta_precio")
      .eq("id", id)
      .maybeSingle();

    if (readError) return { data: null, error: readError.message };
    if (!programa?.imagen_public_id) {
      return { data: null, error: "Agrega una imagen al programa antes de publicarlo." };
    }
    if (programa.mostrar_precio && !programa.etiqueta_precio) {
      return { data: null, error: "Agrega la etiqueta de precio antes de publicarlo." };
    }
  }

  const { data, error } = await supabase
    .from("programas")
    .update({ publicado })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}