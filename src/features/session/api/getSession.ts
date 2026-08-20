import { createSupabaseBrowserClient } from "@/shared/api/supabase/client"
import type { ISessionUser, TRol } from "@/entities/user"

interface IGetSessionResult {
  data: ISessionUser | null
  error: string | null
}

export async function getSession(): Promise<IGetSessionResult> {
  const supabase = createSupabaseBrowserClient()
  const { data, error } = await supabase.auth.getClaims()

  if (error || !data) {
    return { data: null, error: error?.message ?? null }
  }

  const roles = (data.claims.user_roles as TRol[] | undefined) ?? []

  return {
    data: {
      id: data.claims.sub,
      email: data.claims.email ?? "",
      roles,
    },
    error: null,
  }
}
