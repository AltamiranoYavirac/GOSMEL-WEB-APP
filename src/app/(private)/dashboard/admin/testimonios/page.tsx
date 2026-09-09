import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { HydrateQuery } from "@/shared/api/prefetch";
import { TestimoniosList } from "@/features/testimonios";
import { testimoniosListQuery } from "@/features/testimonios/server";

export default async function TestimoniosPage() {
  const supabase = await createSupabaseServerClient();

  return (
    <HydrateQuery queries={[testimoniosListQuery(supabase)]}>
      <TestimoniosList />
    </HydrateQuery>
  );
}
