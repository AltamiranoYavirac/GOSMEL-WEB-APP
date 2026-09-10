import { describe, expect, it } from "vitest"

import { crearCatedraFormSchema, getCrearCatedraFormDefaults } from "./CrearCatedraForm.config"

describe("crearCatedraFormSchema", () => {
  it("aplica defaults", () => {
    const defaults = getCrearCatedraFormDefaults()

    expect(defaults.modalidad).toBe("presencial")
    expect(defaults.estado).toBe("planificada")
    expect(defaults.cupoMaximo).toBe(10)
  })

  it("rechaza requeridos y enums inválidos", () => {
    const base = {
      codigo: "C-01",
      cursoId: "k1",
      docenteId: "p1",
      modalidad: "presencial",
      cupoMaximo: 10,
      estado: "planificada",
    }

    expect(crearCatedraFormSchema.safeParse(base).success).toBe(true)
    expect(crearCatedraFormSchema.safeParse({ ...base, codigo: "C" }).success).toBe(false)
    expect(crearCatedraFormSchema.safeParse({ ...base, cursoId: "" }).success).toBe(false)
    expect(crearCatedraFormSchema.safeParse({ ...base, docenteId: "" }).success).toBe(false)
    expect(crearCatedraFormSchema.safeParse({ ...base, modalidad: "mixta" }).success).toBe(false)
    expect(crearCatedraFormSchema.safeParse({ ...base, estado: "pausada" }).success).toBe(false)
  })

  it("coerciona cupo y acepta opcionales", () => {
    const parsed = crearCatedraFormSchema.parse({
      codigo: "C-01",
      cursoId: "k1",
      docenteId: "p1",
      modalidad: "virtual",
      cupoMaximo: "15",
      estado: "en_curso",
      aula: "A1",
      fechaInicio: "2026-06-01",
      fechaFin: "2026-07-01",
      diaSemana: "1",
      horaInicio: "15:00",
      horaFin: "16:00",
    })

    expect(parsed.cupoMaximo).toBe(15)
    expect(parsed.aula).toBe("A1")

    expect(crearCatedraFormSchema.safeParse({ codigo: "C-01", cursoId: "k1", docenteId: "p1", modalidad: "virtual", cupoMaximo: 500, estado: "en_curso" }).success).toBe(false)
  })
})
