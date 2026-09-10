import { describe, expect, it } from "vitest"

import { crearCursoFormSchema, getCrearCursoFormDefaults } from "./CrearCursoForm.config"

function validValues() {
  return {
    ...getCrearCursoFormDefaults(),
    nombre: "Guitarra",
    descripcion: "Curso completo de guitarra clásica",
    nivel: "basico" as const,
    modalidad: "presencial" as const,
    cupoMaximo: 10,
    publicado: true,
    destacado: false,
    asignarDocente: false,
  }
}

describe("crearCursoFormSchema", () => {
  it("rechaza nombre corto, descripción corta y cupo fuera de rango", () => {
    expect(crearCursoFormSchema.safeParse({ ...validValues(), nombre: "Gu" }).success).toBe(false)
    expect(crearCursoFormSchema.safeParse({ ...validValues(), descripcion: "corta" }).success).toBe(false)
    expect(crearCursoFormSchema.safeParse({ ...validValues(), cupoMaximo: 500 }).success).toBe(false)
    expect(crearCursoFormSchema.safeParse({ ...validValues(), cupoMaximo: -1 }).success).toBe(false)
  })

  it("coerciona cupo y rechaza nivel o modalidad inválidos", () => {
    const parsed = crearCursoFormSchema.parse({ ...validValues(), cupoMaximo: "20" })
    expect(parsed.cupoMaximo).toBe(20)

    expect(crearCursoFormSchema.safeParse({ ...validValues(), nivel: "experto" }).success).toBe(false)
    expect(crearCursoFormSchema.safeParse({ ...validValues(), modalidad: "mixta" }).success).toBe(false)
  })

  it("exige docente cuando asignarDocente es true", () => {
    const result = crearCursoFormSchema.safeParse({
      ...validValues(),
      asignarDocente: true,
      docenteId: "",
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === "docenteId")).toBe(true)
    }
  })

  it("acepta docente y opcionales válidos", () => {
    const result = crearCursoFormSchema.parse({
      ...validValues(),
      asignarDocente: true,
      docenteId: "p1",
      instrumentoId: "i1",
      duracionSemanas: 12,
      horasTotales: null,
      resumen: "Resumen",
      aula: "A1",
    })

    expect(result.docenteId).toBe("p1")
    expect(result.duracionSemanas).toBe(12)
  })
})
