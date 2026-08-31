import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function updateDocente(
  id: string,
  patch: { publicado?: boolean; destacado?: boolean }
): Promise<{ data: { perfil_id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("docentes")
    .update(patch)
    .eq("perfil_id", id)
    .select("perfil_id")
    .maybeSingle();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}