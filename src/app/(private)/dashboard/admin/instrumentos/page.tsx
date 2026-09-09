import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { HydrateQuery } from "@/shared/api/prefetch";
import { InstrumentosList } from "@/features/instrumentos";
import { instrumentosListQuery } from "@/features/instrumentos/server";

export default async function InstrumentosPage() {
  const supabase = await createSupabaseServerClient();

  return (
    <HydrateQuery queries={[instrumentosListQuery(supabase)]}>
      <InstrumentosList />
    </HydrateQuery>
  );
}
