import { redirect } from "next/navigation"

import { createSupabaseServerClient } from "@/shared/api/supabase/server"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.getClaims()

  if (error || !data) {
    redirect("/login")
  }

  return children
}
