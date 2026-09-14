export const AVATAR_FOLDER = "gosmel/avatares"

export function esAvatarGestionado(publicId: string | null): publicId is string {
  return typeof publicId === "string" && publicId.startsWith(`${AVATAR_FOLDER}/`)
}
