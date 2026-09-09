import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { HydrateQuery } from "@/shared/api/prefetch";
import { GaleriaList } from "@/features/galeria";
import { galeriaListQuery } from "@/features/galeria/server";

export default async function GaleriaPage() {
  const supabase = await createSupabaseServerClient();

  return (
    <HydrateQuery queries={[galeriaListQuery(supabase)]}>
      <GaleriaList />
    </HydrateQuery>
  );
}
