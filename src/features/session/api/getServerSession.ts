import { cache } from "react"

import { createSupabaseServerClient } from "@/shared/api/supabase/server"
import { resolveHomeRoute, type ISessionUser, type TRol } from "@/entities/user"

export type IServerSessionResult =
  | { kind: "authenticated"; data: ISessionUser; error: null }
  | { kind: "anonymous"; data: null; error: null }
  | { kind: "error"; data: null; error: string }

export const getServerSession = cache(async (): Promise<IServerSessionResult> => {
  const supabase = await createSupabaseServerClient()
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims()

  if (claimsError) {
    return { kind: "error", data: null, error: claimsError.message }
  }

  if (!claimsData) {
    return { kind: "anonymous", data: null, error: null }
  }

  const userId = claimsData.claims.sub
  const [perfil, rolesResult] = await Promise.all([
    supabase
      .from("perfiles")
      .select("nombres, apellidos, email, avatar_public_id, activo")
      .eq("id", userId)
      .maybeSingle(),
    supabase.from("perfil_rol").select("rol").eq("perfil_id", userId),
  ])

  if (perfil.error || rolesResult.error) {
    return {
      kind: "error",
      data: null,
      error: perfil.error?.message ?? rolesResult.error?.message ?? "No se pudo cargar la sesión",
    }
  }

  const roles = (rolesResult.data ?? []).map((item) => item.rol as TRol)
  const displayName = [perfil.data?.nombres, perfil.data?.apellidos].filter(Boolean).join(" ").trim()
  const email = claimsData.claims.email ?? perfil.data?.email ?? ""

  return {
    kind: "authenticated",
    data: {
      id: userId,
      email,
      displayName: displayName || email.split("@")[0] || "Usuario",
      avatarPublicId: perfil.data?.avatar_public_id ?? null,
      roles,
      homeRoute: resolveHomeRoute(roles),
      isActive: perfil.data?.activo ?? false,
    },
    error: null,
  }
})
