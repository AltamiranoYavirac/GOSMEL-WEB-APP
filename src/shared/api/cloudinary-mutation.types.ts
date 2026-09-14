import type { TCloudinaryImageFolder } from "./cloudinary.types"

export interface ICloudinaryMutationInput<TData> {
  file?: File | null
  folder: TCloudinaryImageFolder
  currentPublicId?: string | null
  removeCurrent?: boolean
  persist: (publicId: string | null) => Promise<{ data: TData | null; error: string | null }>
}
