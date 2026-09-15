import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import { buildMetricaUpdatePayload, type IMetricaFormValues } from "../model/MetricaForm.config";

export async function actualizarMetrica(id: string, values: IMetricaFormValues) {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("metricas_academia")
    .update(buildMetricaUpdatePayload(values))
    .eq("id", id)
    .select("id")
    .maybeSingle();
  if (error || !data) return { data: null, error: error?.message ?? "No se pudo actualizar la métrica." };
  return { data, error: null };
}
