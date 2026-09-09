import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { HydrateQuery } from "@/shared/api/prefetch";
import { EvaluacionesList } from "@/features/evaluaciones";
import { evaluacionesListQuery } from "@/features/evaluaciones/server";

export default async function EvaluacionesPage() {
  const supabase = await createSupabaseServerClient();

  return (
    <HydrateQuery queries={[evaluacionesListQuery(supabase)]}>
      <EvaluacionesList />
    </HydrateQuery>
  );
}
