import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IProgramaRow, TNivelCurso } from "../model/programa.types";

export async function getProgramas(): Promise<{
  data: IProgramaRow[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("programas")
    .select(
      "id, nombre, nivel, instrumento_id, instrumentos(nombre), publicado, programa_curso!programa_curso_programa_id_fkey(programa_id)"
    )
    .order("nombre", { ascending: true })
    .limit(200);

  if (error) {
    return { data: null, error: error.message };
  }

  const rows: IProgramaRow[] = (data ?? []).map((programa) => ({
    id: programa.id,
    nombre: programa.nombre,
    nivel: programa.nivel as TNivelCurso | null,
    instrumento: programa.instrumentos?.nombre ?? null,
    numCursos: programa.programa_curso?.length ?? 0,
    publicado: programa.publicado,
  }));

  return { data: rows, error: null };
}