import { redirect } from "next/navigation"

import { getServerSession } from "@/features/session/server"
import { resolveHomeRoute } from "@/entities/user"

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const sessionResult = await getServerSession()

  if (sessionResult.kind === "error") throw new Error(sessionResult.error)
  if (sessionResult.kind === "anonymous") redirect("/login")
  if (!sessionResult.data.isActive) redirect("/auth/signout?reason=inactive")
  if (!sessionResult.data.roles.includes("docente") && !sessionResult.data.roles.includes("admin")) {
    redirect(resolveHomeRoute(sessionResult.data.roles))
  }

  return children
}
