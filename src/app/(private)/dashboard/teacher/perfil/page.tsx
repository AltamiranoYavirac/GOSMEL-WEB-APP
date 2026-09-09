import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { HydrateQuery } from "@/shared/api/prefetch";
import { TeacherPerfilView } from "@/features/teacher-portal";
import { teacherPerfilQuery } from "@/features/teacher-portal/server";

export default async function TeacherPerfilPage() {
  const supabase = await createSupabaseServerClient();

  return (
    <HydrateQuery queries={[teacherPerfilQuery(supabase)]}>
      <TeacherPerfilView />
    </HydrateQuery>
  );
}
