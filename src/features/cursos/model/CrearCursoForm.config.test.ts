import { describe, expect, it } from "vitest"

import { crearCursoFormSchema, getCrearCursoFormDefaults } from "./CrearCursoForm.config"

function validValues() {
  return {
    ...getCrearCursoFormDefaults(),
    nombre: "Guitarra",
    descripcion: "Curso completo de guitarra clásica",
    categoria: "otro" as const,
    nivel: "basico" as const,
    modalidad: "presencial" as const,
    orden: 1,
    publicado: false,
  }
}

describe("crearCursoFormSchema", () => {
  it("rechaza nombre, descripción y orden inválidos", () => {
    expect(crearCursoFormSchema.safeParse({ ...validValues(), nombre: "Gu" }).success).toBe(false)
    expect(crearCursoFormSchema.safeParse({ ...validValues(), descripcion: "corta" }).success).toBe(false)
    expect(crearCursoFormSchema.safeParse({ ...validValues(), orden: -1 }).success).toBe(false)
  })

  it("rechaza nivel o modalidad inválidos", () => {
    expect(crearCursoFormSchema.safeParse({ ...validValues(), nivel: "experto" }).success).toBe(false)
    expect(crearCursoFormSchema.safeParse({ ...validValues(), modalidad: "mixta" }).success).toBe(false)
  })

  it("exige instrumento cuando la categoría es instrumento", () => {
    const result = crearCursoFormSchema.safeParse({
      ...validValues(),
      categoria: "instrumento",
      instrumentoId: "",
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === "instrumentoId")).toBe(true)
    }
  })

  it("exige precio y etiqueta cuando mostrarPrecio está activo", () => {
    const result = crearCursoFormSchema.safeParse({
      ...validValues(),
      mostrarPrecio: true,
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === "precioReferencial")).toBe(true)
      expect(result.error.issues.some((issue) => issue.path[0] === "etiquetaPrecio")).toBe(true)
    }
  })

  it("acepta opcionales válidos", () => {
    const result = crearCursoFormSchema.parse({
      ...validValues(),
      categoria: "instrumento",
      instrumentoId: "i1",
      duracionSemanas: 12,
      horasTotales: null,
      resumen: "Resumen",
      mostrarPrecio: true,
      precioReferencial: 45,
      etiquetaPrecio: "Mensual",
    })

    expect(result.instrumentoId).toBe("i1")
    expect(result.duracionSemanas).toBe(12)
  })
})
