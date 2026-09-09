import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { HydrateQuery } from "@/shared/api/prefetch";
import { AcuerdosList } from "@/features/acuerdos";
import { acuerdosListQuery } from "@/features/acuerdos/server";

export default async function AcuerdosPage() {
  const supabase = await createSupabaseServerClient();

  return (
    <HydrateQuery queries={[acuerdosListQuery(supabase)]}>
      <AcuerdosList />
    </HydrateQuery>
  );
}
