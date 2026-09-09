import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/api/supabase/database.types";

import type { IStudentResena } from "../model/student-dashboard.types";

export async function getStudentReviews(
  estudianteId: string,
  supabase: SupabaseClient<Database> = createSupabaseBrowserClient(),
): Promise<{
  data: IStudentResena[] | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("curso_resenas")
    .select("id, curso_id, puntuacion, comentario, publicado, created_at, cursos(nombre)")
    .eq("estudiante_id", estudianteId)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return { data: null, error: error.message };
  }

  const rows: IStudentResena[] = (data ?? []).map((row) => ({
    id: row.id,
    cursoId: row.curso_id,
    curso: row.cursos?.nombre ?? "Curso",
    puntuacion: row.puntuacion,
    comentario: row.comentario,
    publicado: row.publicado ?? false,
    creadaEn: row.created_at,
  }));

  return { data: rows, error: null };
}