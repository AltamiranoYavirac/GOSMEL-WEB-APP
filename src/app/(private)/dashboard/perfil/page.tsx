import { HydrateQuery } from "@/shared/api/prefetch"
import { createSupabaseServerClient } from "@/shared/api/supabase/server"
import { DatosEstudianteCard, DatosRepresentanteCard, PerfilView } from "@/features/perfil"
import { requireSession } from "@/features/session/server"
import { TeacherPerfilView } from "@/features/teacher-portal"
import { teacherPerfilQuery } from "@/features/teacher-portal/server"

export default async function PerfilPage() {
  const session = await requireSession()
  const esDocente = session.roles.includes("docente")
  const supabase = esDocente ? await createSupabaseServerClient() : null

  return (
    <div className="space-y-10">
      <PerfilView session={session} />

      {session.roles.includes("estudiante") ? <DatosEstudianteCard perfilId={session.id} /> : null}
      {session.roles.includes("representante") ? <DatosRepresentanteCard perfilId={session.id} /> : null}

      {esDocente && supabase ? (
        <HydrateQuery queries={[teacherPerfilQuery(supabase)]}>
          <TeacherPerfilView />
        </HydrateQuery>
      ) : null}
    </div>
  )
}
