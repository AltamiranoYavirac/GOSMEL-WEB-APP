import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function eliminarPrograma(
  programaId: string
): Promise<{ data: { publicId: string | null } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { data: programa, error: readError } = await supabase
    .from("programas")
    .select("imagen_public_id")
    .eq("id", programaId)
    .maybeSingle();

  if (readError) return { data: null, error: readError.message };

  const { error } = await supabase.from("programas").delete().eq("id", programaId);
  if (error) return { data: null, error: error.message };

  return { data: { publicId: programa?.imagen_public_id ?? null }, error: null };
}
