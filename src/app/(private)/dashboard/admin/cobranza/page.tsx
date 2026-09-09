import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { HydrateQuery } from "@/shared/api/prefetch";
import { CobranzaList } from "@/features/cobranza";
import { cobranzaListQuery } from "@/features/cobranza/server";

export default async function CobranzaPage() {
  const supabase = await createSupabaseServerClient();

  return (
    <HydrateQuery queries={[cobranzaListQuery(supabase)]}>
      <CobranzaList />
    </HydrateQuery>
  );
}
