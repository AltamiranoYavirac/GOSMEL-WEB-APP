import { redirect } from "next/navigation"

import { getServerSession } from "@/features/session/server"
import { resolvePrimaryRole } from "@/entities/user"

import DashboardShell from "./_components/DashboardShell"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const sessionResult = await getServerSession()

  if (sessionResult.kind === "error") {
    throw new Error(sessionResult.error)
  }

  if (sessionResult.kind === "anonymous") {
    redirect("/login")
  }

  if (!sessionResult.data.isActive) {
    redirect("/auth/signout?reason=inactive")
  }

  const role = resolvePrimaryRole(sessionResult.data.roles)

  return <DashboardShell role={role} session={sessionResult.data}>{children}</DashboardShell>
}
