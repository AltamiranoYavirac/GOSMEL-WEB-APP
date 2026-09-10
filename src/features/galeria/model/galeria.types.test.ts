import { describe, expect, it } from "vitest"

import { CATEGORIA_MEDIO_BADGE, galeriaImageUrl } from "./galeria.types"

describe("galeriaImageUrl", () => {
  it("construye la URL de Cloudinary con transformaciones", () => {
    expect(galeriaImageUrl("gosmel/galeria/foto1", 800)).toBe(
      "https://res.cloudinary.com/dv9lm0fnm/image/upload/q_auto,f_auto,w_800/gosmel/galeria/foto1",
    )
  })

  it("respeta el ancho solicitado", () => {
    expect(galeriaImageUrl("a", 320)).toContain("w_320")
  })
})

describe("CATEGORIA_MEDIO_BADGE", () => {
  it("tiene label para cada categoría", () => {
    expect(CATEGORIA_MEDIO_BADGE.instalaciones.label).toBe("Instalaciones")
    expect(CATEGORIA_MEDIO_BADGE.conciertos.label).toBe("Conciertos")
    expect(CATEGORIA_MEDIO_BADGE.aulas.label).toBe("Aulas")
    expect(CATEGORIA_MEDIO_BADGE.general.label).toBe("General")
  })
})
