import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { HydrateQuery } from "@/shared/api/prefetch";
import { EstudiantesList } from "@/features/estudiantes";
import { estudiantesListQuery } from "@/features/estudiantes/server";

export default async function EstudiantesPage() {
  const supabase = await createSupabaseServerClient();

  return (
    <HydrateQuery queries={[estudiantesListQuery(supabase)]}>
      <EstudiantesList />
    </HydrateQuery>
  );
}
