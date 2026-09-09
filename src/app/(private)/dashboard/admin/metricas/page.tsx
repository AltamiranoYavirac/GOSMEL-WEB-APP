import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { HydrateQuery } from "@/shared/api/prefetch";
import { MetricasList } from "@/features/metricas";
import { metricasListQuery } from "@/features/metricas/server";

export default async function MetricasPage() {
  const supabase = await createSupabaseServerClient();

  return (
    <HydrateQuery queries={[metricasListQuery(supabase)]}>
      <MetricasList />
    </HydrateQuery>
  );
}
