import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { HydrateQuery } from "@/shared/api/prefetch";
import { ProgramasList } from "@/features/programas";
import { programasListQuery } from "@/features/programas/server";

export default async function ProgramasPage() {
  const supabase = await createSupabaseServerClient();

  return (
    <HydrateQuery queries={[programasListQuery(supabase)]}>
      <ProgramasList />
    </HydrateQuery>
  );
}
