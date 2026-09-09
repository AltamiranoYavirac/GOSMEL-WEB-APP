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
  data: { instrumentos: IOptionItem[]; cursos: IOptionItem[] } | null;
  error: string | null;
}> {
  const [instrumentos, cursos] = await Promise.all([
    supabase
      .from("instrumentos")
      .select("id, nombre")
      .eq("activo", true)
      .order("nombre", { ascending: true })
      .limit(300),
    supabase
      .from("cursos")
      .select("id, nombre")
      .eq("publicado", true)
      .order("nombre", { ascending: true })
      .limit(300),
  ]);

  const firstError = [instrumentos, cursos].map((res) => res.error).find(Boolean);
  if (firstError) {
    return { data: null, error: firstError.message };
  }

  return {
    data: {
      instrumentos: (instrumentos.data ?? []).map((item) => ({ id: item.id, nombre: item.nombre })),
      cursos: (cursos.data ?? []).map((item) => ({ id: item.id, nombre: item.nombre })),
    },
    error: null,
  };
}
