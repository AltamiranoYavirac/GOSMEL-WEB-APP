import { redirect } from "next/navigation"

import { createSupabaseServerClient } from "@/shared/api/supabase/server"
import { resolveHomeRoute, type TRol } from "@/entities/user"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.getClaims()

  if (error || !data) {
    redirect("/login")
  }

  const roles = (data.claims.user_roles as TRol[] | undefined) ?? []

  if (!roles.includes("admin")) {
    redirect(resolveHomeRoute(roles))
  }

  return children
}
