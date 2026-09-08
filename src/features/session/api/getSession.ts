import { createSupabaseBrowserClient } from "@/shared/api/supabase/client"
import { resolveHomeRoute, type ISessionUser, type TRol } from "@/entities/user"

interface IGetSessionResult {
  data: ISessionUser | null
  error: string | null
}

export async function getSession(): Promise<IGetSessionResult> {
  const supabase = createSupabaseBrowserClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) {
    return { data: null, error: userError.message }
  }

  if (!user) {
    return { data: null, error: null }
  }

  const [perfil, rolesResult] = await Promise.all([
    supabase
      .from("perfiles")
      .select("nombres, apellidos, email, avatar_public_id, activo")
      .eq("id", user.id)
      .maybeSingle(),
    supabase.from("perfil_rol").select("rol").eq("perfil_id", user.id),
  ])

  if (perfil.error || rolesResult.error) {
    return {
      data: null,
      error: perfil.error?.message ?? rolesResult.error?.message ?? "No se pudo cargar la sesión",
    }
  }

  const roles = (rolesResult.data ?? []).map((item) => item.rol as TRol)
  const displayName = [perfil.data?.nombres, perfil.data?.apellidos].filter(Boolean).join(" ").trim()

  return {
    data: {
      id: user.id,
      email: user.email ?? perfil.data?.email ?? "",
      displayName: displayName || user.email?.split("@")[0] || "Usuario",
      avatarPublicId: perfil.data?.avatar_public_id ?? null,
      roles,
      homeRoute: resolveHomeRoute(roles),
      isActive: perfil.data?.activo ?? false,
    },
    error: null,
  }
}
