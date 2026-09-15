import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import { buildMetricaPayload, type IMetricaFormValues } from "../model/MetricaForm.config";

export async function crearMetrica(values: IMetricaFormValues) {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.from("metricas_academia").insert(buildMetricaPayload(values)).select("id").single();
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}
