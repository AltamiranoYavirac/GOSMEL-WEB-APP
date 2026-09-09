import { createSupabaseAdminClient } from "@/shared/api/supabase/admin"
import { createSupabaseServerClient } from "@/shared/api/supabase/server"

interface IUpdateUsuarioActivoServerResult {
  data: { id: string } | null
  error: string | null
  status: number
}

function failure(error: string, status: number): IUpdateUsuarioActivoServerResult {
  return { data: null, error, status }
}

async function setAuthAccess(id: string, activo: boolean): Promise<string | null> {
  const adminClient = createSupabaseAdminClient()
  const { error } = await adminClient.auth.admin.updateUserById(id, {
    ban_duration: activo ? "none" : "876000h",
  })

  return error?.message ?? null
}

export async function updateUsuarioActivoServer(
  id: string,
  activo: boolean,
): Promise<IUpdateUsuarioActivoServerResult> {
  try {
    const callerClient = await createSupabaseServerClient()
    const { data: claimsData, error: claimsError } = await callerClient.auth.getClaims()
    const callerId = claimsData?.claims.sub

    if (claimsError || !callerId) return failure("Debes iniciar sesión", 401)
    if (id === callerId && !activo) return failure("No puedes desactivar tu propia cuenta", 400)

    const { data: callerProfile, error: callerProfileError } = await callerClient
      .from("perfiles")
      .select("activo")
      .eq("id", callerId)
      .maybeSingle()

    if (callerProfileError) return failure("No se pudo validar el administrador", 500)
    if (!callerProfile?.activo) return failure("No tienes permisos para realizar esta acción", 403)

    const { data: callerRoles, error: callerRolesError } = await callerClient
      .from("perfil_rol")
      .select("rol")
      .eq("perfil_id", callerId)

    if (callerRolesError) return failure("No se pudo validar el administrador", 500)
    if (!(callerRoles ?? []).some((role) => role.rol === "admin")) {
      return failure("No tienes permisos para realizar esta acción", 403)
    }

    const adminClient = createSupabaseAdminClient()
    const { data: target, error: targetError } = await adminClient
      .from("perfiles")
      .select("id, activo")
      .eq("id", id)
      .maybeSingle()

    if (targetError) return failure("No se pudo consultar el usuario", 500)
    if (!target) return failure("Usuario no encontrado", 404)

    if (!activo) {
      if (target.activo) {
        const { error: profileError } = await adminClient
          .from("perfiles")
          .update({ activo: false })
          .eq("id", id)

        if (profileError) {
          const isLastAdmin = profileError.message.includes("al menos un administrador activo")
          return failure(
            isLastAdmin ? "Debe existir al menos un administrador activo" : "No se pudo desactivar la cuenta",
            isLastAdmin ? 400 : 500,
          )
        }
      }

      const authError = await setAuthAccess(id, false)
      if (!authError) return { data: { id }, error: null, status: 200 }

      const { error: rollbackError } = await adminClient
        .from("perfiles")
        .update({ activo: true })
        .eq("id", id)

      return failure(
        rollbackError
          ? "No se pudo bloquear la cuenta y tampoco restaurar su estado. Contacta al administrador del sistema."
          : "No se pudo bloquear la cuenta. El cambio fue revertido.",
        502,
      )
    }

    const authError = await setAuthAccess(id, true)
    if (authError) return failure("No se pudo habilitar el acceso de la cuenta", 502)

    if (!target.activo) {
      const { error: profileError } = await adminClient
        .from("perfiles")
        .update({ activo: true })
        .eq("id", id)

      if (profileError) {
        const rollbackError = await setAuthAccess(id, false)
        return failure(
          rollbackError
            ? "No se pudo activar el perfil ni restaurar el bloqueo de acceso. Contacta al administrador del sistema."
            : "No se pudo activar el perfil. El cambio fue revertido.",
          500,
        )
      }
    }

    return { data: { id }, error: null, status: 200 }
  } catch {
    return failure("No se pudo actualizar el estado de la cuenta", 500)
  }
}
