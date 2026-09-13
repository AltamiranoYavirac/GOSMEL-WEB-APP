import { HydrateQuery } from "@/shared/api/prefetch"
import { createSupabaseServerClient } from "@/shared/api/supabase/server"
import { PerfilView } from "@/features/perfil"
import { requireSession } from "@/features/session/server"
import { TeacherPerfilView } from "@/features/teacher-portal"
import { teacherPerfilQuery } from "@/features/teacher-portal/server"

export default async function PerfilPage() {
  const session = await requireSession()

  if (!session.roles.includes("docente")) {
    return <PerfilView session={session} />
  }

  const supabase = await createSupabaseServerClient()

  return (
    <div className="space-y-10">
      <PerfilView session={session} />
      <HydrateQuery queries={[teacherPerfilQuery(supabase)]}>
        <TeacherPerfilView />
      </HydrateQuery>
    </div>
  )
}
