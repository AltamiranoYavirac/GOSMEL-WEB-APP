import { requireSession } from "@/features/session/server"
import { resolvePrimaryRole } from "@/entities/user"

import DashboardShell from "./_components/DashboardShell"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession()
  const role = resolvePrimaryRole(session.roles)

  return <DashboardShell role={role} session={session}>{children}</DashboardShell>
}
