import { describe, expect, it } from "vitest"

import { toLocalDateString } from "@/shared/lib"

import { crearCatedraFormSchema, getCrearCatedraFormDefaults } from "./CrearCatedraForm.config"

const HOY = toLocalDateString()
const MANANA = toLocalDateString(new Date(Date.now() + 24 * 60 * 60 * 1000))
const AYER = toLocalDateString(new Date(Date.now() - 24 * 60 * 60 * 1000))
const EN_UN_MES = toLocalDateString(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))

const BASE = {
  codigo: "C-01",
  cursoId: "k1",
  docenteId: "p1",
  modalidad: "presencial",
  cupoMaximo: 10,
  fechaInicio: MANANA,
  estado: "planificada",
}

describe("crearCatedraFormSchema", () => {
  it("aplica defaults", () => {
    const defaults = getCrearCatedraFormDefaults()

    expect(defaults.modalidad).toBe("presencial")
    expect(defaults.estado).toBe("planificada")
    expect(defaults.cupoMaximo).toBe(15)
  })

  it("rechaza requeridos y enums inválidos", () => {
    expect(crearCatedraFormSchema.safeParse(BASE).success).toBe(true)
    expect(crearCatedraFormSchema.safeParse({ ...BASE, codigo: "C" }).success).toBe(false)
    expect(crearCatedraFormSchema.safeParse({ ...BASE, cursoId: "" }).success).toBe(false)
    expect(crearCatedraFormSchema.safeParse({ ...BASE, docenteId: "" }).success).toBe(false)
    expect(crearCatedraFormSchema.safeParse({ ...BASE, modalidad: "mixta" }).success).toBe(false)
    expect(crearCatedraFormSchema.safeParse({ ...BASE, estado: "pausada" }).success).toBe(false)
    expect(crearCatedraFormSchema.safeParse({ ...BASE, fechaInicio: "" }).success).toBe(false)
    expect(crearCatedraFormSchema.safeParse({ ...BASE, fechaFin: AYER }).success).toBe(false)
  })

  it("rechaza una fecha de inicio anterior a hoy y acepta hoy", () => {
    const pasado = crearCatedraFormSchema.safeParse({ ...BASE, fechaInicio: AYER })
    expect(pasado.success).toBe(false)
    if (!pasado.success) {
      expect(pasado.error.issues[0]).toMatchObject({
        path: ["fechaInicio"],
        message: "La fecha de inicio no puede ser anterior a hoy",
      })
    }

    expect(crearCatedraFormSchema.safeParse({ ...BASE, fechaInicio: HOY }).success).toBe(true)
  })

  it("acepta la fecha fin vacía o posterior al inicio", () => {
    expect(crearCatedraFormSchema.safeParse({ ...BASE, fechaFin: "" }).success).toBe(true)
    expect(crearCatedraFormSchema.safeParse({ ...BASE, fechaFin: EN_UN_MES }).success).toBe(true)
    expect(crearCatedraFormSchema.safeParse({ ...BASE, fechaFin: MANANA }).success).toBe(true)
  })

  it("coerciona cupo y acepta opcionales", () => {
    const parsed = crearCatedraFormSchema.parse({
      ...BASE,
      modalidad: "virtual",
      cupoMaximo: "15",
      estado: "en_curso",
      aula: "A1",
      fechaFin: EN_UN_MES,
      diaSemana: "1",
      horaInicio: "15:00",
      horaFin: "16:00",
    })

    expect(parsed.cupoMaximo).toBe(15)
    expect(parsed.aula).toBe("A1")

    expect(
      crearCatedraFormSchema.safeParse({ ...BASE, modalidad: "virtual", cupoMaximo: 500, estado: "en_curso" }).success,
    ).toBe(false)
  })
})
