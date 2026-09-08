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

  if (error || !data.session || !data.user) {
    return { data: null, error: error?.code ?? "unknown_error" }
  }

  const [profileResult, rolesResult] = await Promise.all([
    supabase
      .from("perfiles")
      .select("activo")
      .eq("id", data.user.id)
      .maybeSingle(),
    supabase.from("perfil_rol").select("rol").eq("perfil_id", data.user.id),
  ])

  if (profileResult.error || rolesResult.error) {
    await supabase.auth.signOut()
    return { data: null, error: profileResult.error?.code ?? rolesResult.error?.code ?? "unknown_error" }
  }

  if (!profileResult.data?.activo) {
    await supabase.auth.signOut()
    return { data: null, error: "account_inactive" }
  }

  const roles = (rolesResult.data ?? []).map((role) => role.rol as TRol)

  return { data: { roles }, error: null }
}
