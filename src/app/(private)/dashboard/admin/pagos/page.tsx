import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { HydrateQuery } from "@/shared/api/prefetch";
import { PagosList } from "@/features/pagos";
import { pagosListQuery } from "@/features/pagos/server";

export default async function PagosPage() {
  const supabase = await createSupabaseServerClient();

  return (
    <HydrateQuery queries={[pagosListQuery(supabase)]}>
      <PagosList />
    </HydrateQuery>
  );
}
