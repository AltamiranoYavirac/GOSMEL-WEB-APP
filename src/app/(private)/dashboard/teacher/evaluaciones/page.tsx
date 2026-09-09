import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { HydrateQuery } from "@/shared/api/prefetch";
import { TeacherEvaluacionesView } from "@/features/teacher-portal";
import { teacherEvaluacionesQuery } from "@/features/teacher-portal/server";

export default async function TeacherEvaluacionesPage() {
  const supabase = await createSupabaseServerClient();

  return (
    <HydrateQuery queries={[teacherEvaluacionesQuery(supabase)]}>
      <TeacherEvaluacionesView />
    </HydrateQuery>
  );
}
