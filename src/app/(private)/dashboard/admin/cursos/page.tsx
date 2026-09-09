import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { HydrateQuery } from "@/shared/api/prefetch";
import { CursosList } from "@/features/cursos";
import { cursosListQuery } from "@/features/cursos/server";

export default async function CursosPage() {
  const supabase = await createSupabaseServerClient();

  return (
    <HydrateQuery queries={[cursosListQuery(supabase)]}>
      <CursosList />
    </HydrateQuery>
  );
}
