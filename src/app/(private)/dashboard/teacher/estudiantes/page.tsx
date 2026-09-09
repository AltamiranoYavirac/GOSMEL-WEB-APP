import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { HydrateQuery } from "@/shared/api/prefetch";
import { TeacherEstudiantesView } from "@/features/teacher-portal";
import { teacherEstudiantesQuery } from "@/features/teacher-portal/server";

export default async function TeacherEstudiantesPage() {
  const supabase = await createSupabaseServerClient();

  return (
    <HydrateQuery queries={[teacherEstudiantesQuery(supabase)]}>
      <TeacherEstudiantesView />
    </HydrateQuery>
  );
}
