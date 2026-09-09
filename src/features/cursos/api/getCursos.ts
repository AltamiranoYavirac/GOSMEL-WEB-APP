import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/api/supabase/database.types";

import type { ICursoRow, TModalidadCurso, TNivelCurso } from "../model/curso.types";

export async function getCursos(
  supabase: SupabaseClient<Database> = createSupabaseBrowserClient(),
): Promise<{
  data: ICursoRow[] | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("cursos")
    .select(
      "id, nombre, nivel, modalidad, instrumento_id, instrumentos(nombre), puntuacion_promedio, total_resenas, publicado, destacado, curso_modulos(id)"
    )
    .order("nombre", { ascending: true })
    .limit(300);

  if (error) {
    return { data: null, error: error.message };
  }

  const rows: ICursoRow[] = (data ?? []).map((curso) => ({
    id: curso.id,
    nombre: curso.nombre,
    nivel: curso.nivel as TNivelCurso,
    modalidad: curso.modalidad as TModalidadCurso,
    instrumento: curso.instrumentos?.nombre ?? null,
    rating: curso.puntuacion_promedio,
    totalResenas: curso.total_resenas,
    modulos: curso.curso_modulos?.length ?? 0,
    destacado: curso.destacado,
    publicado: curso.publicado,
  }));

  return { data: rows, error: null };
}