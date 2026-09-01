import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function updateResenaPublicado(
  resenaId: string,
  publicado: boolean
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase
    .from("curso_resenas")
    .update({ publicado })
    .eq("id", resenaId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function eliminarResena(
  resenaId: string
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.from("curso_resenas").delete().eq("id", resenaId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
