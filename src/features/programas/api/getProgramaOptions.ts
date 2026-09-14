import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/api/supabase/database.types";

export interface IOptionItem {
  id: string;
  nombre: string;
}

export async function getProgramaOptions(
  supabase: SupabaseClient<Database> = createSupabaseBrowserClient(),
): Promise<{
  data: { cursos: IOptionItem[] } | null;
  error: string | null;
}> {
  const cursos = await supabase
    .from("cursos")
    .select("id, nombre")
    .order("nombre", { ascending: true })
    .limit(300);

  if (cursos.error) {
    return { data: null, error: cursos.error.message };
  }

  return {
    data: {
      cursos: (cursos.data ?? []).map((item) => ({ id: item.id, nombre: item.nombre })),
    },
    error: null,
  };
}
