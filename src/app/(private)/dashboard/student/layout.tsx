import { redirect } from "next/navigation"

import { getServerSession } from "@/features/session/server"
import { resolveHomeRoute } from "@/entities/user"
import { StudentPortalLayout } from "@/features/student-portal"

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const sessionResult = await getServerSession()

  if (sessionResult.kind === "error") throw new Error(sessionResult.error)
  if (sessionResult.kind === "anonymous") redirect("/login")
  if (!sessionResult.data.isActive) redirect("/auth/signout?reason=inactive")
  if (sessionResult.data.roles.includes("admin") || sessionResult.data.roles.includes("docente")) {
    redirect(resolveHomeRoute(sessionResult.data.roles))
  }

  return <StudentPortalLayout>{children}</StudentPortalLayout>
}
