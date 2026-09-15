import type { ICloudinaryImageMeta, TCloudinaryImageFolder } from "./cloudinary.types"

export async function uploadCloudinaryImage(
  file: File,
  folder: TCloudinaryImageFolder,
  meta: ICloudinaryImageMeta = {},
) {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("folder", folder)
  if (meta.displayName) formData.append("display_name", meta.displayName)
  if (meta.tags && meta.tags.length > 0) formData.append("tags", meta.tags.join(","))

  const response = await fetch("/api/upload/cloudinary", {
    method: "POST",
    body: formData,
  })
  const result = await response.json()

  if (!response.ok || result.error) {
    return { data: null, error: result.error ?? "No se pudo subir la imagen." }
  }

  return {
    data: {
      publicId: result.public_id as string,
      secureUrl: result.secure_url as string,
    },
    error: null,
  }
}

export async function deleteCloudinaryImage(publicId: string) {
  const response = await fetch("/api/upload/cloudinary", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ publicId }),
  })
  const result = await response.json()

  if (!response.ok || result.error) {
    return { error: result.error ?? "No se pudo eliminar la imagen." }
  }

  return { error: null }
}
