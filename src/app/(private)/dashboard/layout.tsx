import { redirect } from "next/navigation"

import { createSupabaseServerClient } from "@/shared/api/supabase/server"
import { resolvePrimaryRole, type TRol } from "@/entities/user"

import DashboardShell from "./_components/DashboardShell"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.getClaims()

  if (error || !data) {
    redirect("/login")
  }

  const roles = (data.claims.user_roles as TRol[] | undefined) ?? []
  const role = resolvePrimaryRole(roles)

  return <DashboardShell role={role}>{children}</DashboardShell>
}
