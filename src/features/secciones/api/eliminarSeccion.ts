import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function eliminarSeccion(
  id: string
): Promise<{ data: { publicId: string | null } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { data: item, error: readError } = await supabase
    .from("secciones_institucionales")
    .select("imagen_public_id")
    .eq("id", id)
    .maybeSingle();

  if (readError || !item) return { data: null, error: readError?.message ?? "No se encontró la sección." };

  const { error } = await supabase.from("secciones_institucionales").delete().eq("id", id);
  if (error) return { data: null, error: error.message };

  return { data: { publicId: item.imagen_public_id }, error: null };
}
