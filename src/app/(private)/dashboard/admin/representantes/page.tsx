import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { HydrateQuery } from "@/shared/api/prefetch";
import { RepresentantesList } from "@/features/representantes";
import { representantesListQuery } from "@/features/representantes/server";

export default async function RepresentantesPage() {
  const supabase = await createSupabaseServerClient();

  return (
    <HydrateQuery queries={[representantesListQuery(supabase)]}>
      <RepresentantesList />
    </HydrateQuery>
  );
}
