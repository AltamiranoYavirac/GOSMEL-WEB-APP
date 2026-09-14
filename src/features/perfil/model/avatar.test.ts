import { describe, expect, it } from "vitest"

import { AVATAR_FOLDER, esAvatarGestionado } from "./avatar"

describe("esAvatarGestionado", () => {
  it("acepta public_ids dentro de la carpeta de avatares", () => {
    expect(esAvatarGestionado(`${AVATAR_FOLDER}/abc123`)).toBe(true)
    expect(esAvatarGestionado(`${AVATAR_FOLDER}/sub/abc123`)).toBe(true)
  })

  it("rechaza ids de otras carpetas, URLs y valores vacíos", () => {
    expect(esAvatarGestionado("gosmel/cursos/abc")).toBe(false)
    expect(esAvatarGestionado(AVATAR_FOLDER)).toBe(false)
    expect(esAvatarGestionado("https://res.cloudinary.com/x/abc.png")).toBe(false)
    expect(esAvatarGestionado("")).toBe(false)
    expect(esAvatarGestionado(null)).toBe(false)
  })
})
