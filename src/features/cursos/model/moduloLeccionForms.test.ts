import { describe, expect, it } from "vitest"

import { getLeccionFormDefaults, leccionFormSchema } from "./LeccionForm.config"
import { getModuloFormDefaults, moduloFormSchema } from "./ModuloForm.config"

describe("moduloFormSchema", () => {
  it("valida título y defaults", () => {
    expect(moduloFormSchema.safeParse({ titulo: "M" }).success).toBe(false)

    const parsed = moduloFormSchema.parse({ titulo: "Módulo" })
    expect(parsed.orden).toBe(0)
    expect(getModuloFormDefaults({ titulo: "X" }).titulo).toBe("X")
    expect(getModuloFormDefaults().orden).toBe(0)
  })

  it("rechaza orden negativo", () => {
    expect(moduloFormSchema.safeParse({ titulo: "Módulo", orden: -1 }).success).toBe(false)
  })
})

describe("leccionFormSchema", () => {
  it("valida requeridos, duración y defaults", () => {
    expect(leccionFormSchema.safeParse({ titulo: "L" }).success).toBe(false)
    expect(leccionFormSchema.safeParse({ titulo: "Lección", duracionMinutos: 0 }).success).toBe(false)
    expect(leccionFormSchema.safeParse({ titulo: "Lección", orden: -1 }).success).toBe(false)

    const parsed = leccionFormSchema.parse({ titulo: "Lección", duracionMinutos: 10 })
    expect(parsed.esMuestra).toBe(false)
    expect(parsed.orden).toBe(0)
    expect(getLeccionFormDefaults({ esMuestra: true }).esMuestra).toBe(true)
  })
})
