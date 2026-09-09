import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { HydrateQuery } from "@/shared/api/prefetch";
import { SolicitudesList } from "@/features/solicitudes";
import { solicitudesListQuery } from "@/features/solicitudes/server";

export default async function SolicitudesPage() {
  const supabase = await createSupabaseServerClient();

  return (
    <HydrateQuery queries={[solicitudesListQuery(supabase)]}>
      <SolicitudesList />
    </HydrateQuery>
  );
}
