import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { HydrateQuery } from "@/shared/api/prefetch";
import { MatriculasList } from "@/features/matriculas";
import { matriculasPendientesQuery } from "@/features/matriculas/server";

export default async function MatriculasPage() {
  const supabase = await createSupabaseServerClient();

  return (
    <HydrateQuery queries={[matriculasPendientesQuery(supabase)]}>
      <MatriculasList />
    </HydrateQuery>
  );
}
