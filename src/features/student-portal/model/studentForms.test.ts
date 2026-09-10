import { describe, expect, it } from "vitest"

import { crearResenaFormSchema } from "./CrearResenaForm.config"
import { registrarPracticaFormSchema } from "./RegistrarPracticaForm.config"
import { reportarPagoFormSchema } from "./ReportarPagoForm.config"
import { solicitarMatriculaFormSchema } from "./SolicitarMatriculaForm.config"

describe("reportarPagoFormSchema", () => {
  it("valida monto, método y límites", () => {
    const base = { monto: 50, metodo: "transferencia", referencia: "", comprobanteStoragePath: "", observacion: "" }

    expect(reportarPagoFormSchema.safeParse(base).success).toBe(true)
    expect(reportarPagoFormSchema.safeParse({ ...base, monto: "50" }).success).toBe(true)
    expect(reportarPagoFormSchema.safeParse({ ...base, monto: 0 }).success).toBe(false)
    expect(reportarPagoFormSchema.safeParse({ ...base, metodo: "" }).success).toBe(false)
    expect(reportarPagoFormSchema.safeParse({ ...base, referencia: "x".repeat(101) }).success).toBe(false)
    expect(reportarPagoFormSchema.safeParse({ ...base, observacion: "x".repeat(301) }).success).toBe(false)
  })
})

describe("crearResenaFormSchema", () => {
  it("valida puntuación entera entre 1 y 5", () => {
    expect(crearResenaFormSchema.safeParse({ cursoId: "k1", puntuacion: 5, comentario: "" }).success).toBe(true)
    expect(crearResenaFormSchema.safeParse({ cursoId: "", puntuacion: 5 }).success).toBe(false)
    expect(crearResenaFormSchema.safeParse({ cursoId: "k1", puntuacion: 0 }).success).toBe(false)
    expect(crearResenaFormSchema.safeParse({ cursoId: "k1", puntuacion: 6 }).success).toBe(false)
    expect(crearResenaFormSchema.safeParse({ cursoId: "k1", puntuacion: 3.5 }).success).toBe(false)
    expect(crearResenaFormSchema.safeParse({ cursoId: "k1", puntuacion: 3, comentario: "x".repeat(1001) }).success).toBe(false)
  })
})

describe("registrarPracticaFormSchema", () => {
  it("valida minutos y límites", () => {
    const base = { inscripcionId: "i1", fecha: "2026-06-15", minutos: 30, nota: "" }

    expect(registrarPracticaFormSchema.safeParse(base).success).toBe(true)
    expect(registrarPracticaFormSchema.safeParse({ ...base, minutos: "45" }).success).toBe(true)
    expect(registrarPracticaFormSchema.safeParse({ ...base, inscripcionId: "" }).success).toBe(false)
    expect(registrarPracticaFormSchema.safeParse({ ...base, fecha: "" }).success).toBe(false)
    expect(registrarPracticaFormSchema.safeParse({ ...base, minutos: 0 }).success).toBe(false)
    expect(registrarPracticaFormSchema.safeParse({ ...base, minutos: 601 }).success).toBe(false)
    expect(registrarPracticaFormSchema.safeParse({ ...base, nota: "x".repeat(501) }).success).toBe(false)
  })
})

describe("solicitarMatriculaFormSchema", () => {
  it("exige datos del menor cuando paraMenor es true", () => {
    const incomplete = solicitarMatriculaFormSchema.safeParse({ catedraId: "c1", paraMenor: true })
    expect(incomplete.success).toBe(false)
    if (!incomplete.success) {
      const paths = incomplete.error.issues.map((issue) => issue.path[0])
      expect(paths).toEqual(expect.arrayContaining(["nombres", "apellidos", "fechaNacimiento", "parentesco"]))
    }

    expect(
      solicitarMatriculaFormSchema.safeParse({
        catedraId: "c1",
        paraMenor: true,
        nombres: "Ada",
        apellidos: "Lovelace",
        fechaNacimiento: "2015-01-01",
        parentesco: "madre",
      }).success,
    ).toBe(true)
  })

  it("no exige datos si no es para menor y requiere cátedra", () => {
    expect(solicitarMatriculaFormSchema.safeParse({ catedraId: "c1", paraMenor: false }).success).toBe(true)
    expect(solicitarMatriculaFormSchema.safeParse({ catedraId: "", paraMenor: false }).success).toBe(false)
  })
})
