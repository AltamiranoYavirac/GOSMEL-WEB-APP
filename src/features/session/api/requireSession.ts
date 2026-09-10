import { redirect } from "next/navigation"

import { resolveHomeRoute, type ISessionUser, type TRol } from "@/entities/user"
import { getServerSession } from "./getServerSession"

export async function requireSession(allowed?: TRol[]): Promise<ISessionUser> {
  const result = await getServerSession()

  if (result.kind === "error") throw new Error(result.error)
  if (result.kind === "anonymous") redirect("/login")
  if (!result.data.isActive) redirect("/auth/signout?reason=inactive")

  if (allowed && !allowed.some((rol) => result.data.roles.includes(rol))) {
    redirect(resolveHomeRoute(result.data.roles))
  }

  return result.data
}
