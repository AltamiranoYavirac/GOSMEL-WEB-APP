import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { HydrateQuery } from "@/shared/api/prefetch";
import { CuotasList } from "@/features/cuotas";
import { cuotasListQuery } from "@/features/cuotas/server";

export default async function CuotasPage() {
  const supabase = await createSupabaseServerClient();

  return (
    <HydrateQuery queries={[cuotasListQuery(supabase)]}>
      <CuotasList />
    </HydrateQuery>
  );
}
