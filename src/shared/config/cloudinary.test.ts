import { describe, expect, it } from "vitest"

import { buildCloudinaryFolder, isAllowedCloudinaryFolder } from "./cloudinary"

describe("cloudinary folders", () => {
  it("acepta carpetas base y una subcarpeta simple", () => {
    expect(isAllowedCloudinaryFolder("gosmel/cursos")).toBe(true)
    expect(isAllowedCloudinaryFolder("gosmel/secciones")).toBe(true)
    expect(isAllowedCloudinaryFolder("gosmel/secciones/abc-123")).toBe(true)
  })

  it("rechaza rutas fuera de gosmel o con segmentos extra", () => {
    expect(isAllowedCloudinaryFolder("gosmel/avatares")).toBe(false)
    expect(isAllowedCloudinaryFolder("../gosmel/cursos")).toBe(false)
    expect(isAllowedCloudinaryFolder("gosmel/cursos/abc/def")).toBe(false)
    expect(isAllowedCloudinaryFolder("otra/cursos")).toBe(false)
    expect(isAllowedCloudinaryFolder("gosmel/cursos/UPPER")).toBe(false)
  })

  it("construye carpetas con id válido y cae al base si no lo es", () => {
    expect(buildCloudinaryFolder("gosmel/secciones", "abc-123")).toBe("gosmel/secciones/abc-123")
    expect(buildCloudinaryFolder("gosmel/secciones", "UPPER")).toBe("gosmel/secciones")
    expect(buildCloudinaryFolder("gosmel/secciones", "../../x")).toBe("gosmel/secciones")
    expect(buildCloudinaryFolder("gosmel/secciones")).toBe("gosmel/secciones")
  })
})
