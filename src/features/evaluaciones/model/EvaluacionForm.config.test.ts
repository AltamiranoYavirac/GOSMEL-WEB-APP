import { describe, expect, it } from "vitest"

import { evaluacionFormSchema, getEvaluacionFormDefaults } from "./EvaluacionForm.config"

describe("evaluacionFormSchema", () => {
  it("aplica defaults", () => {
    const parsed = evaluacionFormSchema.parse({ catedraId: "c1", titulo: "Parcial" })

    expect(parsed.tipo).toBe("formativa")
    expect(parsed.notaMaxima).toBe(10)
    expect(parsed.ponderacion).toBe(20)
    expect(getEvaluacionFormDefaults().tipo).toBe("formativa")
  })

  it("rechaza requeridos y rangos", () => {
    expect(evaluacionFormSchema.safeParse({ catedraId: "", titulo: "Parcial" }).success).toBe(false)
    expect(evaluacionFormSchema.safeParse({ catedraId: "c1", titulo: "P" }).success).toBe(false)
    expect(evaluacionFormSchema.safeParse({ catedraId: "c1", titulo: "Parcial", tipo: "oral" }).success).toBe(false)
    expect(evaluacionFormSchema.safeParse({ catedraId: "c1", titulo: "Parcial", notaMaxima: 0 }).success).toBe(false)
    expect(evaluacionFormSchema.safeParse({ catedraId: "c1", titulo: "Parcial", ponderacion: -1 }).success).toBe(false)
    expect(evaluacionFormSchema.safeParse({ catedraId: "c1", titulo: "Parcial", ponderacion: 101 }).success).toBe(false)
  })

  it("acepta opcionales", () => {
    const parsed = evaluacionFormSchema.parse({
      catedraId: "c1",
      titulo: "Parcial",
      tipo: "examen_practico",
      descripcion: "Desc",
      fecha: "",
      notaMaxima: 20,
      ponderacion: 50,
    })

    expect(parsed.fecha).toBe("")
    expect(parsed.notaMaxima).toBe(20)
  })
})
