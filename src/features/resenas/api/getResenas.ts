import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IResenaRow } from "../model/resena.types";

export async function getResenas(): Promise<{
  data: IResenaRow[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("curso_resenas")
    .select("id, curso_id, estudiante_id, puntuacion, comentario, publicado, created_at, cursos(nombre), estudiantes(nombres, apellidos)")
    .order("created_at", { ascending: false })
    .limit(300);

  if (error) {
    return { data: null, error: error.message };
  }

  const rows: IResenaRow[] = (data ?? []).map((item) => ({
    id: item.id,
    cursoId: item.curso_id,
    curso: item.cursos?.nombre ?? "Sin curso",
    estudianteId: item.estudiante_id,
    estudiante: item.estudiantes ? `${item.estudiantes.nombres} ${item.estudiantes.apellidos}`.trim() : "Estudiante",
    puntuacion: item.puntuacion,
    comentario: item.comentario,
    publicado: item.publicado,
    createdAt: item.created_at,
  }));

  return { data: rows, error: null };
}
