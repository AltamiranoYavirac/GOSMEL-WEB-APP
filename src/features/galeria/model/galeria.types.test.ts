import { describe, expect, it } from "vitest"

import { buildCloudinaryImageUrl } from "@/shared/lib"
import { CATEGORIA_MEDIO_BADGE } from "./galeria.types"

describe("buildCloudinaryImageUrl", () => {
  it("construye la URL de Cloudinary con transformaciones", () => {
    expect(buildCloudinaryImageUrl("gosmel/galeria/foto1", "q_auto,f_auto,w_800")).toBe(
      "https://res.cloudinary.com/dv9lm0fnm/image/upload/q_auto,f_auto,w_800/gosmel/galeria/foto1",
    )
  })

  it("respeta la transformación solicitada", () => {
    expect(buildCloudinaryImageUrl("a", "q_auto,w_320")).toContain("w_320")
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
