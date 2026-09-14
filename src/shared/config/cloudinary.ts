import type { TCloudinaryImageFolder } from "@/shared/api/cloudinary.types"

export const CLOUDINARY_IMAGE_FOLDERS = [
  "gosmel/cursos",
  "gosmel/programas",
  "gosmel/galeria",
  "gosmel/sitio",
] as const satisfies readonly TCloudinaryImageFolder[]

export const CLOUDINARY_MAX_IMAGE_SIZE = 10 * 1024 * 1024
export const CLOUDINARY_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const
