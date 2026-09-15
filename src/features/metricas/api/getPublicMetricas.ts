import { cache } from "react";

import { createSupabasePublicClient } from "@/shared/api/supabase/public";

import type { IPublicMetrica } from "../model/metrica.types";

export const getPublicMetricas = cache(async (): Promise<{
  data: IPublicMetrica[];
  error: string | null;
}> => {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("metricas_academia")
    .select("id, etiqueta, valor, sufijo, icono")
    .eq("publicado", true)
    .order("orden", { ascending: true })
    .limit(8);

  if (error) return { data: [], error: error.message };

  return { data: data ?? [], error: null };
});
