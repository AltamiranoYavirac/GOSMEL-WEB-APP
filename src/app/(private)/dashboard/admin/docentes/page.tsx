import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { HydrateQuery } from "@/shared/api/prefetch";
import { DocentesList } from "@/features/docentes";
import { docentesListQuery } from "@/features/docentes/server";

export default async function DocentesPage() {
  const supabase = await createSupabaseServerClient();

  return (
    <HydrateQuery queries={[docentesListQuery(supabase)]}>
      <DocentesList />
    </HydrateQuery>
  );
}
