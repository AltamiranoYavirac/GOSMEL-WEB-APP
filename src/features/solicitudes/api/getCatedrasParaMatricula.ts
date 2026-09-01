import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export interface ICatedraMatriculaOption {
  id: string;
  label: string;
}

export async function getCatedrasParaMatricula(): Promise<{
  data: ICatedraMatriculaOption[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("catedras")
    .select("id, codigo, cursos(nombre)")
    .in("estado", ["planificada", "en_curso"])
    .order("codigo", { ascending: true })
    .limit(300);

  if (error) {
    return { data: null, error: error.message };
  }

  const rows: ICatedraMatriculaOption[] = (data ?? []).map((catedra) => ({
    id: catedra.id,
    label: `${catedra.codigo} · ${catedra.cursos?.nombre ?? "Sin curso"}`,
  }));

  return { data: rows, error: null };
}