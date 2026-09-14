import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { TablesUpdate } from "@/shared/api/supabase/database.types";

export async function updateCurso(
  id: string,
  patch: TablesUpdate<"cursos">
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("cursos")
    .update(patch)
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return { data: null, error: error?.message ?? "No se pudo actualizar el curso." };
  }

  return { data, error: null };
}
