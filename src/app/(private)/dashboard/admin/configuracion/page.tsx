import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { HydrateQuery } from "@/shared/api/prefetch";
import { ConfiguracionView } from "@/features/configuracion";
import { siteConfigQuery } from "@/features/configuracion/server";

export default async function ConfiguracionPage() {
  const supabase = await createSupabaseServerClient();

  return (
    <HydrateQuery queries={[siteConfigQuery(supabase)]}>
      <ConfiguracionView />
    </HydrateQuery>
  );
}
