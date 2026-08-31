import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export interface ICatedraSelectOption {
  id: string;
  label: string;
}

export async function getCatedrasParaHorarios(): Promise<{
  data: ICatedraSelectOption[] | null;
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

  const options: ICatedraSelectOption[] = (data ?? []).map((c) => ({
    id: c.id,
    label: `${c.codigo} · ${c.cursos?.nombre ?? "Sin curso"}`,
  }));

  return { data: options, error: null };
}
