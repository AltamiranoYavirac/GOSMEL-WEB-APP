import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/api/supabase/database.types";

import { resolveProgramaInstrumento } from "../model/programa-instrumento";
import type { IProgramaRow, TNivelCurso } from "../model/programa.types";

export async function getProgramas(
  supabase: SupabaseClient<Database> = createSupabaseBrowserClient(),
): Promise<{
  data: IProgramaRow[] | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("programas")
    .select(
      "id, nombre, nivel, publicado, orden, programa_curso!programa_curso_programa_id_fkey(cursos(instrumentos(nombre, tipos_instrumento(nombre))))"
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
    instrumento: resolveProgramaInstrumento(
      (programa.programa_curso ?? []).map((vinculo) => ({
        instrumento: vinculo.cursos?.instrumentos?.nombre ?? null,
        familia: vinculo.cursos?.instrumentos?.tipos_instrumento?.nombre ?? null,
      }))
    ),
    numCursos: programa.programa_curso?.length ?? 0,
    publicado: programa.publicado,
    orden: programa.orden,
  }));

  return { data: rows, error: null };
}