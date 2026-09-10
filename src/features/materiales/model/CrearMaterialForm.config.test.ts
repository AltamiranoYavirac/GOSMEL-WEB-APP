import { describe, expect, it } from "vitest"

import {
  crearMaterialFormSchema,
  getCrearMaterialFormDefaults,
} from "./CrearMaterialForm.config"

function validValues() {
  return {
    ...getCrearMaterialFormDefaults(),
    titulo: "Partitura",
    tipo: "pdf" as const,
    visibilidad: "docentes" as const,
  }
}

describe("crearMaterialFormSchema", () => {
  it("rechaza título corto y enums inválidos", () => {
    expect(crearMaterialFormSchema.safeParse({ ...validValues(), titulo: "ab" }).success).toBe(false)
    expect(crearMaterialFormSchema.safeParse({ ...validValues(), tipo: "zip" }).success).toBe(false)
    expect(crearMaterialFormSchema.safeParse({ ...validValues(), visibilidad: "nadie" }).success).toBe(false)
  })

  it("exige curso cuando el destino es curso", () => {
    const result = crearMaterialFormSchema.safeParse({ ...validValues(), destino: "curso", cursoId: "" })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === "cursoId")).toBe(true)
    }

    expect(
      crearMaterialFormSchema.safeParse({ ...validValues(), destino: "curso", cursoId: "k1" }).success,
    ).toBe(true)
  })

  it("exige cátedra cuando el destino es cátedra", () => {
    const result = crearMaterialFormSchema.safeParse({ ...validValues(), destino: "catedra", catedraId: "" })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === "catedraId")).toBe(true)
    }

    expect(
      crearMaterialFormSchema.safeParse({ ...validValues(), destino: "catedra", catedraId: "c1" }).success,
    ).toBe(true)
  })

  it("acepta urlExterna vacía y destino general", () => {
    expect(crearMaterialFormSchema.safeParse({ ...validValues(), urlExterna: "" }).success).toBe(true)
  })
})
