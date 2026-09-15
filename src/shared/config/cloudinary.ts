import type {
  TCloudinaryImageBaseFolder,
  TCloudinaryImageFolder,
} from "@/shared/api/cloudinary.types"

export const CLOUDINARY_IMAGE_FOLDERS = [
  "gosmel/cursos",
  "gosmel/programas",
  "gosmel/galeria",
  "gosmel/sitio",
  "gosmel/secciones",
  "gosmel/testimonios",
] as const satisfies readonly TCloudinaryImageBaseFolder[]

export const CLOUDINARY_MAX_IMAGE_SIZE = 10 * 1024 * 1024
export const CLOUDINARY_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const

const CLOUDINARY_SUBFOLDER_PATTERN = /^[a-z0-9][a-z0-9-]*$/

export function buildCloudinaryFolder(
  base: TCloudinaryImageBaseFolder,
  entityId?: string | null,
): TCloudinaryImageFolder {
  if (!entityId || !CLOUDINARY_SUBFOLDER_PATTERN.test(entityId)) return base
  return `${base}/${entityId}`
}

export function isAllowedCloudinaryFolder(folder: string): folder is TCloudinaryImageFolder {
  const base = CLOUDINARY_IMAGE_FOLDERS.find(
    (candidate) => folder === candidate || folder.startsWith(`${candidate}/`),
  )
  if (!base) return false
  if (folder === base) return true
  return CLOUDINARY_SUBFOLDER_PATTERN.test(folder.slice(base.length + 1))
}
