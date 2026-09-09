import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { HydrateQuery } from "@/shared/api/prefetch";
import { TeacherMaterialesView } from "@/features/teacher-portal";
import { teacherMaterialesQuery } from "@/features/teacher-portal/server";

export default async function TeacherMaterialesPage() {
  const supabase = await createSupabaseServerClient();

  return (
    <HydrateQuery queries={[teacherMaterialesQuery(supabase)]}>
      <TeacherMaterialesView />
    </HydrateQuery>
  );
}
