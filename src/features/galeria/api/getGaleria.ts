import type { SupabaseClient } from "@supabase/supabase-js";

import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { Database } from "@/shared/api/supabase/database.types";

import type { IGaleriaMedioRow, TCategoriaMedio } from "../model/galeria.types";

export async function getGaleria(
  supabase: SupabaseClient<Database> = createSupabaseBrowserClient(),
): Promise<{ data: IGaleriaMedioRow[] | null; error: string | null }> {
  const { data, error } = await supabase
    .from("galeria_medios")
    .select("id, titulo, texto_alt, categoria, public_id, curso_id, cursos(nombre), orden, publicado")
    .order("orden", { ascending: true })
    .limit(300);

  if (error) return { data: null, error: error.message };

  return {
    data: (data ?? []).map((medio) => ({
      id: medio.id,
      titulo: medio.titulo,
      textoAlt: medio.texto_alt,
      categoria: medio.categoria as TCategoriaMedio,
      publicId: medio.public_id,
      cursoId: medio.curso_id,
      curso: medio.cursos?.nombre ?? null,
      orden: medio.orden,
      publicado: medio.publicado,
    })),
    error: null,
  };
}
