import { redirect } from "next/navigation"

import { resolveHomeRoute } from "@/entities/user"
import { getServerSession } from "@/features/session/server"

export default async function DashboardIndexPage() {
  const sessionResult = await getServerSession()

  if (sessionResult.kind === "error") throw new Error(sessionResult.error)
  if (sessionResult.kind === "anonymous") redirect("/login")
  if (!sessionResult.data.isActive) redirect("/auth/signout?reason=inactive")

  redirect(resolveHomeRoute(sessionResult.data.roles))
}
