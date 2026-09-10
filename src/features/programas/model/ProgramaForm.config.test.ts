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
      objetivos: "Obj",
      nivel: "intermedio",
      instrumentoId: "i1",
      publicado: true,
      orden: 2,
    })

    expect(parsed.instrumentoId).toBe("i1")
    expect(programaFormSchema.safeParse({ nombre: "Integral", orden: -1 }).success).toBe(false)
  })
})
