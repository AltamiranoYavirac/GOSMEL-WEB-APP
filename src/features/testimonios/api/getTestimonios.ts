import type { SupabaseClient } from "@supabase/supabase-js";

import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { Database } from "@/shared/api/supabase/database.types";

import type { ITestimonioRow } from "../model/testimonio.types";

export async function getTestimonios(
  supabase: SupabaseClient<Database> = createSupabaseBrowserClient(),
): Promise<{ data: ITestimonioRow[] | null; error: string | null }> {
  const { data, error } = await supabase
    .from("testimonios")
    .select("id, autor_nombre, autor_rol, cita, puntuacion, curso_id, cursos(nombre), orden, publicado")
    .order("orden", { ascending: true })
    .limit(200);

  if (error) return { data: null, error: error.message };
  return {
    data: (data ?? []).map((item) => ({
      id: item.id,
      autor: item.autor_nombre,
      rol: item.autor_rol,
      cita: item.cita,
      puntuacion: item.puntuacion,
      cursoId: item.curso_id,
      curso: item.cursos?.nombre ?? null,
      orden: item.orden,
      publicado: item.publicado,
    })),
    error: null,
  };
}
