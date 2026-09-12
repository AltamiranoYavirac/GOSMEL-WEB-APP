import { cloudinary } from "@/shared/api/cloudinary"
import { createSupabaseServerClient } from "@/shared/api/supabase/server"
import type { ISessionUser } from "@/entities/user"

import { esAvatarGestionado } from "../model/avatar"

interface IEliminarAvatarServerResult {
  data: { eliminado: true } | null
  error: string | null
  status: number
}

function failure(error: string, status: number): IEliminarAvatarServerResult {
  return { data: null, error, status }
}

export async function eliminarAvatarServer(
  session: ISessionUser,
): Promise<IEliminarAvatarServerResult> {
  try {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase
      .from("perfiles")
      .update({ avatar_public_id: null })
      .eq("id", session.id)

    if (error) return failure("No se pudo quitar la foto de perfil", 500)

    if (esAvatarGestionado(session.avatarPublicId)) {
      await cloudinary.uploader.destroy(session.avatarPublicId).catch(() => {})
    }

    return { data: { eliminado: true }, error: null, status: 200 }
  } catch {
    return failure("No se pudo quitar la foto de perfil", 500)
  }
}
