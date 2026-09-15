import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/api/supabase/database.types";

import type { ISeccionRow } from "../model/seccion.types";

export async function getSecciones(
  supabase: SupabaseClient<Database> = createSupabaseBrowserClient(),
): Promise<{
  data: ISeccionRow[] | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("secciones_institucionales")
    .select("id, titulo, clave, contenido, imagen_public_id, imagen_texto_alt, orden, updated_at, publicado")
    .order("orden", { ascending: true })
    .limit(200);

  if (error) {
    return { data: null, error: error.message };
  }

  const rows: ISeccionRow[] = (data ?? []).map((seccion) => ({
    id: seccion.id,
    titulo: seccion.titulo,
    clave: seccion.clave,
    contenido: seccion.contenido,
    imagenPublicId: seccion.imagen_public_id,
    imagenTextoAlt: seccion.imagen_texto_alt,
    orden: seccion.orden,
    actualizado: seccion.updated_at,
    publicado: seccion.publicado,
  }));

  return { data: rows, error: null };
}