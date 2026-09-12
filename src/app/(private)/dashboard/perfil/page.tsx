import { requireSession } from "@/features/session/server"
import { PerfilView } from "@/features/perfil"

export default async function PerfilPage() {
  const session = await requireSession()

  return <PerfilView session={session} />
}
