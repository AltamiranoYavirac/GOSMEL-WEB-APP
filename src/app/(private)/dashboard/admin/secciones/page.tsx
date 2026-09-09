import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { HydrateQuery } from "@/shared/api/prefetch";
import { SeccionesList } from "@/features/secciones";
import { seccionesListQuery } from "@/features/secciones/server";

export default async function SeccionesPage() {
  const supabase = await createSupabaseServerClient();

  return (
    <HydrateQuery queries={[seccionesListQuery(supabase)]}>
      <SeccionesList />
    </HydrateQuery>
  );
}
