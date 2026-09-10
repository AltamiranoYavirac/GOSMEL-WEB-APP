import { describe, expect, it } from "vitest"

import { createFakeSupabase } from "@/test/supabase"

import { getTeacherCalificaciones } from "./getTeacherCalificaciones"

function buildTables() {
  return {
    evaluaciones: [
      {
        id: "ev1",
        catedra_id: "c1",
        titulo: "Parcial 1",
        tipo: "parcial",
        nota_maxima: 10,
        ponderacion: 30,
        fecha: "2026-06-01",
        catedras: { codigo: "C-01", cursos: { nombre: "Guitarra" } },
      },
    ],
    inscripciones: [
      {
        id: "i1",
        estudiante_id: "e1",
        catedra_id: "c1",
        estado: "activa",
        estudiantes: { id: "e1", nombres: "Ada", apellidos: "Lovelace" },
      },
      {
        id: "i2",
        estudiante_id: "e2",
        catedra_id: "c1",
        estado: "activa",
        estudiantes: null,
      },
      {
        id: "i3",
        estudiante_id: "e3",
        catedra_id: "c1",
        estado: "retirada",
        estudiantes: { id: "e3", nombres: "Fuera", apellidos: "Curso" },
      },
    ],
    calificaciones: [
      { evaluacion_id: "ev1", inscripcion_id: "i1", nota: 8.5, observacion: "bien", calificada_en: "2026-06-02" },
    ],
  }
}

describe("getTeacherCalificaciones", () => {
  it("devuelve error si la evaluación no existe", async () => {
    const result = await getTeacherCalificaciones("missing", createFakeSupabase(buildTables()))

    expect(result.data).toBeNull()
    expect(result.error).toBeTruthy()
  })

  it("combina inscripciones activas con sus calificaciones", async () => {
    const result = await getTeacherCalificaciones("ev1", createFakeSupabase(buildTables()))

    expect(result.error).toBeNull()
    expect(result.data).toMatchObject({
      evaluacionId: "ev1",
      catedraId: "c1",
      catedraCodigo: "C-01",
      cursoNombre: "Guitarra",
      titulo: "Parcial 1",
      tipo: "parcial",
      notaMaxima: 10,
      ponderacion: 30,
    })

    expect(result.data!.estudiantes).toHaveLength(2)
    expect(result.data!.estudiantes[0]).toEqual({
      inscripcionId: "i1",
      estudianteId: "e1",
      estudianteNombre: "Ada Lovelace",
      nota: 8.5,
      observacion: "bien",
      calificadaEn: "2026-06-02",
    })
    expect(result.data!.estudiantes[1]).toEqual({
      inscripcionId: "i2",
      estudianteId: "e2",
      estudianteNombre: "Estudiante",
      nota: null,
      observacion: null,
      calificadaEn: null,
    })
  })

  it("propaga el error de inscripciones", async () => {
    const result = await getTeacherCalificaciones(
      "ev1",
      createFakeSupabase.withError("inscripciones", "boom", buildTables()),
    )

    expect(result).toEqual({ data: null, error: "boom" })
  })
})
