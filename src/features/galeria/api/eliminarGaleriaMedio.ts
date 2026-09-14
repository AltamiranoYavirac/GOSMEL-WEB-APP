import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function eliminarGaleriaMedio(
  id: string
): Promise<{ data: { publicId: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { data: item, error: readError } = await supabase
    .from("galeria_medios")
    .select("public_id")
    .eq("id", id)
    .maybeSingle();

  if (readError || !item) return { data: null, error: readError?.message ?? "No se encontró el medio." };

  const { error } = await supabase.from("galeria_medios").delete().eq("id", id);
  if (error) return { data: null, error: error.message };

  return { data: { publicId: item.public_id }, error: null };
}
