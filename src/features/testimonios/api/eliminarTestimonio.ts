import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function eliminarTestimonio(
  id: string
): Promise<{ data: { publicId: string | null } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { data: item, error: readError } = await supabase
    .from("testimonios")
    .select("foto_public_id")
    .eq("id", id)
    .maybeSingle();

  if (readError || !item) return { data: null, error: readError?.message ?? "No se encontró el testimonio." };

  const { error } = await supabase.from("testimonios").delete().eq("id", id);
  if (error) return { data: null, error: error.message };

  return { data: { publicId: item.foto_public_id }, error: null };
}
