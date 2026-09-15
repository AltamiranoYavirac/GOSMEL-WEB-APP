import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function updateSolicitudNotas(
  id: string,
  notasInternas: string
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("solicitudes")
    .update({ notas_internas: notasInternas || null })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}
