import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { HydrateQuery } from "@/shared/api/prefetch";
import { CatedrasList } from "@/features/catedras";
import { catedrasListQuery } from "@/features/catedras/server";

export default async function CatedrasPage() {
  const supabase = await createSupabaseServerClient();

  return (
    <HydrateQuery queries={[catedrasListQuery(supabase)]}>
      <CatedrasList />
    </HydrateQuery>
  );
}
