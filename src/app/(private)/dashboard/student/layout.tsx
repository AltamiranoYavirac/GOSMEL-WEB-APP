import { redirect } from "next/navigation";

import { type TRol } from "@/entities/user";
import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { StudentPortalLayout } from "@/features/student-portal";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data) {
    redirect("/login");
  }

  const roles = (data.claims.user_roles as TRol[] | undefined) ?? [];

  if (roles.includes("admin")) {
    redirect("/dashboard/admin");
  }
  if (roles.includes("docente")) {
    redirect("/dashboard/teacher");
  }

  return <StudentPortalLayout>{children}</StudentPortalLayout>;
}