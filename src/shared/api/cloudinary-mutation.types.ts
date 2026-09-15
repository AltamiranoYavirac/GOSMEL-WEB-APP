import type { ICloudinaryImageMeta, TCloudinaryImageFolder } from "./cloudinary.types"

export interface ICloudinaryMutationInput<TData> {
  file?: File | null
  folder: TCloudinaryImageFolder
  currentPublicId?: string | null
  removeCurrent?: boolean
  deleteCurrentAfterPersist?: boolean
  meta?: ICloudinaryImageMeta
  persist: (publicId: string | null) => Promise<{ data: TData | null; error: string | null }>
}
