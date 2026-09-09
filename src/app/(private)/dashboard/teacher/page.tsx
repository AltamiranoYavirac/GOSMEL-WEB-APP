import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { HydrateQuery } from "@/shared/api/prefetch";
import { TeacherResumenView } from "@/features/teacher-portal";
import { teacherDashboardQuery } from "@/features/teacher-portal/server";

export default async function TeacherDashboardPage() {
  const supabase = await createSupabaseServerClient();

  return (
    <HydrateQuery queries={[teacherDashboardQuery(supabase)]}>
      <TeacherResumenView />
    </HydrateQuery>
  );
}
