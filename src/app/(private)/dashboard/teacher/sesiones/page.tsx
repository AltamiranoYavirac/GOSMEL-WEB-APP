import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { HydrateQuery } from "@/shared/api/prefetch";
import { TeacherSesionesView } from "@/features/teacher-portal";
import { teacherSesionesQuery } from "@/features/teacher-portal/server";

export default async function TeacherSesionesPage() {
  const supabase = await createSupabaseServerClient();

  return (
    <HydrateQuery queries={[teacherSesionesQuery(supabase)]}>
      <TeacherSesionesView />
    </HydrateQuery>
  );
}
