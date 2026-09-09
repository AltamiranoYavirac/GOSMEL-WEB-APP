import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/api/supabase/database.types";

export interface ICatedraOptionItem {
  id: string;
  label: string;
}

export async function getCatedrasOptions(
  supabase: SupabaseClient<Database> = createSupabaseBrowserClient(),
): Promise<{
  data: ICatedraOptionItem[] | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("catedras")
    .select("id, codigo, cursos(nombre)")
    .in("estado", ["planificada", "en_curso"])
    .order("codigo", { ascending: true });

  if (error) {
    return { data: null, error: error.message };
  }

  const options: ICatedraOptionItem[] = (data ?? []).map((c) => ({
    id: c.id,
    label: `${c.codigo} · ${c.cursos?.nombre ?? "Sin curso"}`,
  }));

  return { data: options, error: null };
}
