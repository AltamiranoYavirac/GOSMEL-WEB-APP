import { cloudinary } from "@/shared/api/cloudinary"
import { createSupabaseServerClient } from "@/shared/api/supabase/server"
import type { ISessionUser } from "@/entities/user"

import { AVATAR_FOLDER, esAvatarGestionado } from "../model/avatar"

const MAX_AVATAR_BYTES = 10 * 1024 * 1024
const AVATAR_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"])

interface ISubirAvatarServerResult {
  data: { publicId: string; url: string } | null
  error: string | null
  status: number
}

function failure(error: string, status: number): ISubirAvatarServerResult {
  return { data: null, error, status }
}

export async function subirAvatarServer(
  session: ISessionUser,
  file: File,
): Promise<ISubirAvatarServerResult> {
  try {
    if (!AVATAR_MIME_TYPES.has(file.type)) {
      return failure("Formato no soportado. Usa una imagen JPG, PNG o WEBP.", 400)
    }
    if (file.size > MAX_AVATAR_BYTES) {
      return failure("La imagen supera el límite de 10MB", 400)
    }

    const bytes = await file.arrayBuffer()
    const base64Data = `data:${file.type};base64,${Buffer.from(bytes).toString("base64")}`

    const upload = await cloudinary.uploader.upload(base64Data, {
      folder: AVATAR_FOLDER,
      resource_type: "image",
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    })

    const supabase = await createSupabaseServerClient()
    const { error } = await supabase
      .from("perfiles")
      .update({ avatar_public_id: upload.public_id })
      .eq("id", session.id)

    if (error) {
      await cloudinary.uploader.destroy(upload.public_id).catch(() => {})
      return failure("No se pudo guardar la foto en tu perfil", 500)
    }

    if (esAvatarGestionado(session.avatarPublicId)) {
      await cloudinary.uploader.destroy(session.avatarPublicId).catch(() => {})
    }

    return {
      data: { publicId: upload.public_id, url: upload.secure_url },
      error: null,
      status: 200,
    }
  } catch {
    return failure("No se pudo subir la foto de perfil", 500)
  }
}
