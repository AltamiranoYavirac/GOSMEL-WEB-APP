import { createSupabaseServerClient } from "@/shared/api/supabase/server"
import { HydrateQuery } from "@/shared/api/prefetch"
import { requireSession } from "@/features/session/server"
import { StudentPortalLayout } from "@/features/student-portal"
import { studentContextQuery } from "@/features/student-portal/server"

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  await requireSession(["estudiante", "representante"])

  const supabase = await createSupabaseServerClient()

  return (
    <HydrateQuery queries={[studentContextQuery(supabase)]}>
      <StudentPortalLayout>{children}</StudentPortalLayout>
    </HydrateQuery>
  )
}
