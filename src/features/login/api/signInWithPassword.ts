import { createSupabaseBrowserClient } from "@/shared/api/supabase/client"
import type { TRol } from "@/entities/user"

interface ISignInWithPasswordParams {
  email: string
  password: string
}

interface ISignInWithPasswordResult {
  data: { roles: TRol[] } | null
  error: string | null
}

export async function signInWithPassword({
  email,
  password,
}: ISignInWithPasswordParams): Promise<ISignInWithPasswordResult> {
  const supabase = createSupabaseBrowserClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !data.session) {
    return { data: null, error: error?.code ?? "unknown_error" }
  }

  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims()

  if (claimsError || !claimsData) {
    return { data: null, error: claimsError?.code ?? "unknown_error" }
  }

  const roles = (claimsData.claims.user_roles as TRol[] | undefined) ?? []

  return { data: { roles }, error: null }
}
