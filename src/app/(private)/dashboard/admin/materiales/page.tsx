import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { HydrateQuery } from "@/shared/api/prefetch";
import { MaterialesList } from "@/features/materiales";
import { materialesListQuery } from "@/features/materiales/server";

export default async function MaterialesPage() {
  const supabase = await createSupabaseServerClient();

  return (
    <HydrateQuery queries={[materialesListQuery(supabase)]}>
      <MaterialesList />
    </HydrateQuery>
  );
}
