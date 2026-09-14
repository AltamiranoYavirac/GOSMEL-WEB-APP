const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "dv9lm0fnm"
const CLOUDINARY_IMAGE_BASE = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`

export function buildCloudinaryImageUrl(
  publicId: string | null | undefined,
  transformation = "q_auto,f_auto"
): string | null {
  if (!publicId) return null
  if (publicId.startsWith("http://") || publicId.startsWith("https://")) return publicId
  return `${CLOUDINARY_IMAGE_BASE}/${transformation}/${publicId}`
}
