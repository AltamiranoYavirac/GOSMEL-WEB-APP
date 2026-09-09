import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/api/supabase/database.types";

import type { IStudentFavorito, TNivelCurso } from "../model/student-dashboard.types";

export async function getStudentFavorites(
  supabase: SupabaseClient<Database> = createSupabaseBrowserClient(),
): Promise<{
  data: IStudentFavorito[] | null;
  error: string | null;
}> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: "No autenticado" };
  }

  const { data, error } = await supabase
    .from("favoritos")
    .select("curso_id, cursos(nombre, nivel, portada_public_id)")
    .eq("perfil_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  const rows: IStudentFavorito[] = (data ?? []).map((row) => ({
    cursoId: row.curso_id,
    nombre: row.cursos?.nombre ?? "Curso",
    nivel: (row.cursos?.nivel ?? null) as TNivelCurso | null,
    portadaPublicId: row.cursos?.portada_public_id ?? null,
  }));

  return { data: rows, error: null };
}