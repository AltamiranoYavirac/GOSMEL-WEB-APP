import { cache } from "react";

import { createSupabasePublicClient } from "@/shared/api/supabase/public";

import type { IPublicGaleriaItem, TCategoriaMedio } from "../model/galeria.types";

export const getPublicGaleria = cache(async (): Promise<{
  data: IPublicGaleriaItem[];
  error: string | null;
}> => {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("galeria_medios")
    .select("id, titulo, texto_alt, categoria, public_id")
    .is("curso_id", null)
    .eq("publicado", true)
    .order("orden", { ascending: true })
    .limit(24);

  if (error) return { data: [], error: error.message };

  return {
    data: (data ?? []).map((item) => ({
      id: item.id,
      titulo: item.titulo,
      alt: item.texto_alt,
      categoria: item.categoria as TCategoriaMedio,
      publicId: item.public_id,
    })),
    error: null,
  };
});
