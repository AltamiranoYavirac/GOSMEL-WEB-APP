import { cache } from "react";

import { createSupabasePublicClient } from "@/shared/api/supabase/public";

import type { IPublicSeccion } from "../model/seccion.types";

export const getPublicSecciones = cache(async (): Promise<{
  data: IPublicSeccion[];
  error: string | null;
}> => {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("secciones_institucionales")
    .select("id, clave, titulo, contenido, imagen_public_id, imagen_texto_alt")
    .eq("publicado", true)
    .order("orden", { ascending: true })
    .limit(12);

  if (error) return { data: [], error: error.message };

  return {
    data: (data ?? []).map((item) => ({
      id: item.id,
      clave: item.clave,
      titulo: item.titulo,
      contenido: item.contenido,
      imagenPublicId: item.imagen_public_id,
      imagenTextoAlt: item.imagen_texto_alt,
    })),
    error: null,
  };
});
