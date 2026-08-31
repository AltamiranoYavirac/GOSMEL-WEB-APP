import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function eliminarModulo(
  moduloId: string
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.from("curso_modulos").delete().eq("id", moduloId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
