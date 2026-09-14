import { describe, expect, it } from "vitest"

import type { IAsignacionDocente, IAsignacionRow } from "./asignacion.types"
import { docentesCompatibles, instrumentosRequeridos, opcionesDocentePara } from "./compatibilidad"

function catedra(overrides: Partial<IAsignacionRow> = {}): IAsignacionRow {
  return {
    catedraId: "c1",
    codigo: "CAT-2026-01",
    curso: "Guitarra",
    instrumentoId: "i1",
    instrumento: "Guitarra",
    docenteId: "p1",
    docente: "Leo Brouwer",
    estudiantesActivos: 0,
    sesiones: 0,
    estado: "en_curso",
    ...overrides,
  }
}

const DOCENTES: IAsignacionDocente[] = [
  { id: "p1", nombre: "Leo Brouwer", instrumentoIds: ["i1"] },
  { id: "p2", nombre: "Ada Lovelace", instrumentoIds: ["i2"] },
  { id: "p3", nombre: "Alan Turing", instrumentoIds: ["i1", "i2"] },
  { id: "p4", nombre: "Grace Hopper", instrumentoIds: [] },
]

describe("instrumentosRequeridos", () => {
  it("devuelve los instrumentos únicos y omite cursos sin instrumento", () => {
    const requeridos = instrumentosRequeridos([
      catedra({ catedraId: "c1", instrumentoId: "i1" }),
      catedra({ catedraId: "c2", instrumentoId: "i2" }),
      catedra({ catedraId: "c3", instrumentoId: "i1" }),
      catedra({ catedraId: "c4", instrumentoId: null }),
    ])

    expect(requeridos.sort()).toEqual(["i1", "i2"])
  })

  it("devuelve lista vacía si ningún curso tiene instrumento", () => {
    expect(instrumentosRequeridos([catedra({ instrumentoId: null })])).toEqual([])
  })
})

describe("docentesCompatibles", () => {
  it("exige que el docente enseñe todos los instrumentos requeridos", () => {
    expect(docentesCompatibles(DOCENTES, ["i1"]).map((d) => d.id)).toEqual(["p1", "p3"])
    expect(docentesCompatibles(DOCENTES, ["i1", "i2"]).map((d) => d.id)).toEqual(["p3"])
  })

  it("sin instrumentos requeridos devuelve todos los docentes", () => {
    expect(docentesCompatibles(DOCENTES, [])).toEqual(DOCENTES)
  })

  it("devuelve lista vacía si nadie es compatible", () => {
    expect(docentesCompatibles(DOCENTES, ["i9"])).toEqual([])
  })
})

describe("opcionesDocentePara", () => {
  it("filtra por el instrumento del curso", () => {
    expect(
      opcionesDocentePara(catedra({ instrumentoId: "i2", docenteId: "p2" }), DOCENTES).map((d) => d.id),
    ).toEqual(["p2", "p3"])
  })

  it("mantiene al docente actual aunque no enseñe el instrumento", () => {
    const opciones = opcionesDocentePara(catedra({ instrumentoId: "i2", docenteId: "p1" }), DOCENTES)

    expect(opciones.map((d) => d.id)).toEqual(["p1", "p2", "p3"])
  })

  it("ofrece todos los docentes si el curso no tiene instrumento", () => {
    expect(opcionesDocentePara(catedra({ instrumentoId: null }), DOCENTES)).toEqual(DOCENTES)
  })
})
