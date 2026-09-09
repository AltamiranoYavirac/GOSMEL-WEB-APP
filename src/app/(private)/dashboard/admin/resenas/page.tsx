import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { HydrateQuery } from "@/shared/api/prefetch";
import { ResenasList } from "@/features/resenas";
import { resenasListQuery } from "@/features/resenas/server";

export default async function ResenasPage() {
  const supabase = await createSupabaseServerClient();

  return (
    <HydrateQuery queries={[resenasListQuery(supabase)]}>
      <ResenasList />
    </HydrateQuery>
  );
}
