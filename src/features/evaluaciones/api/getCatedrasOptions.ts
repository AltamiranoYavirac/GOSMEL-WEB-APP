import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export interface ICatedraOptionItem {
  id: string;
  label: string;
}

export async function getCatedrasOptions(): Promise<{
  data: ICatedraOptionItem[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
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
