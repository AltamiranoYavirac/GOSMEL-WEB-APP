import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { ISeccionRow } from "../model/seccion.types";

export async function getSecciones(): Promise<{
  data: ISeccionRow[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("secciones_institucionales")
    .select("id, titulo, clave, orden, updated_at, publicado")
    .order("orden", { ascending: true })
    .limit(200);

  if (error) {
    return { data: null, error: error.message };
  }

  const rows: ISeccionRow[] = (data ?? []).map((seccion) => ({
    id: seccion.id,
    titulo: seccion.titulo,
    clave: seccion.clave,
    orden: seccion.orden,
    actualizado: seccion.updated_at,
    publicado: seccion.publicado,
  }));

  return { data: rows, error: null };
}