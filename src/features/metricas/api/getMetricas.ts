import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IMetricaRow } from "../model/metrica.types";

export async function getMetricas(): Promise<{
  data: IMetricaRow[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("metricas_academia")
    .select("id, etiqueta, valor, sufijo, icono, orden, publicado")
    .order("orden", { ascending: true })
    .limit(200);

  if (error) {
    return { data: null, error: error.message };
  }

  const rows: IMetricaRow[] = (data ?? []).map((metrica) => ({
    id: metrica.id,
    etiqueta: metrica.etiqueta,
    valor: metrica.valor,
    sufijo: metrica.sufijo,
    icono: metrica.icono,
    orden: metrica.orden,
    publicado: metrica.publicado,
  }));

  return { data: rows, error: null };
}