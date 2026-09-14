import { describe, expect, it } from "vitest"

import { programaFormSchema } from "./ProgramaForm.config"

describe("programaFormSchema", () => {
  it("rechaza nombre corto y nivel inválido", () => {
    expect(programaFormSchema.safeParse({ nombre: "A", publicado: false, orden: 0 }).success).toBe(false)
    expect(
      programaFormSchema.safeParse({ nombre: "Integral", nivel: "experto", publicado: false, orden: 0 }).success,
    ).toBe(false)
  })

  it("aplica defaults de publicado y orden", () => {
    const parsed = programaFormSchema.parse({ nombre: "Integral" })

    expect(parsed.publicado).toBe(false)
    expect(parsed.orden).toBe(0)
  })

  it("acepta campos opcionales y rechaza orden negativo", () => {
    const parsed = programaFormSchema.parse({
      nombre: "Integral",
      descripcion: "Desc",
      nivel: "intermedio",
      imagenPublicId: "gosmel/programas/integral",
      imagenTextoAlt: "Programa integral",
      publicado: true,
      orden: 2,
    })

    expect(parsed.nivel).toBe("intermedio")
    expect(programaFormSchema.safeParse({ nombre: "Integral", orden: -1 }).success).toBe(false)
  })

  it("exige precio y etiqueta cuando mostrarPrecio está activo", () => {
    const result = programaFormSchema.safeParse({ nombre: "Integral", mostrarPrecio: true })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === "precioReferencial")).toBe(true)
      expect(result.error.issues.some((issue) => issue.path[0] === "etiquetaPrecio")).toBe(true)
    }
    expect(
      programaFormSchema.safeParse({
        nombre: "Integral",
        mostrarPrecio: true,
        precioReferencial: 150,
        etiquetaPrecio: "$150 / mes",
      }).success,
    ).toBe(true)
  })
})
