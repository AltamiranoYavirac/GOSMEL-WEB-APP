import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { HydrateQuery } from "@/shared/api/prefetch";
import { TeacherCatedrasView } from "@/features/teacher-portal";
import { teacherCatedrasQuery } from "@/features/teacher-portal/server";

export default async function TeacherCatedrasPage() {
  const supabase = await createSupabaseServerClient();

  return (
    <HydrateQuery queries={[teacherCatedrasQuery(supabase)]}>
      <TeacherCatedrasView />
    </HydrateQuery>
  );
}
