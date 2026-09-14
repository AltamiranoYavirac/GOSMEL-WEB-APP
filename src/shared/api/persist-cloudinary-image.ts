import { deleteCloudinaryImage, uploadCloudinaryImage } from "./cloudinary-client"
import type { ICloudinaryMutationInput } from "./cloudinary-mutation.types"

export async function persistCloudinaryImage<TData>({
  file,
  folder,
  currentPublicId,
  removeCurrent = false,
  persist,
}: ICloudinaryMutationInput<TData>) {
  let nextPublicId = removeCurrent ? null : currentPublicId ?? null

  if (file) {
    const upload = await uploadCloudinaryImage(file, folder)
    if (upload.error || !upload.data) {
      return { data: null, error: upload.error ?? "No se pudo subir la imagen.", cleanupError: null }
    }
    nextPublicId = upload.data.publicId
  }

  const result = await persist(nextPublicId)
  if (result.error || !result.data) {
    if (file && nextPublicId) await deleteCloudinaryImage(nextPublicId)
    return { data: null, error: result.error ?? "No se pudo guardar el registro.", cleanupError: null }
  }

  let cleanupError: string | null = null
  if (currentPublicId && currentPublicId !== nextPublicId) {
    const cleanup = await deleteCloudinaryImage(currentPublicId)
    cleanupError = cleanup.error
  }

  return { data: result.data, error: null, cleanupError }
}
