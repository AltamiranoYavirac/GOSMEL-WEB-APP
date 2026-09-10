import { beforeEach, describe, expect, it } from "vitest"

const { createSupabaseBrowserClientMock } = vi.hoisted(() => ({
  createSupabaseBrowserClientMock: vi.fn(),
}))

vi.mock("@/shared/api/supabase/client", () => ({
  createSupabaseBrowserClient: createSupabaseBrowserClientMock,
}))

import { createFakeSupabase } from "@/test/supabase"
import type { TFakeSupabaseClient } from "@/test/supabase.types"

import { crearEvaluacion } from "./crearEvaluacion"
import { eliminarEvaluacion } from "./eliminarEvaluacion"
import { getCalificacionesEvaluacion } from "./getCalificacionesEvaluacion"
import { getCatedrasOptions } from "./getCatedrasOptions"
import { getEvaluaciones } from "./getEvaluaciones"
import { guardarCalificaciones } from "./guardarCalificaciones"

function configure(tables: Record<string, Record<string, unknown>[]> = {}): TFakeSupabaseClient {
  const fake = createFakeSupabase(tables, { user: { id: "u1" } })
  createSupabaseBrowserClientMock.mockReturnValue(fake)
  return fake
}

const EVALUACION_VALUES = {
  catedraId: "c1",
  titulo: " Parcial 1 ",
  tipo: "sumativa" as const,
  descripcion: " desc ",
  fecha: "2026-06-01",
  notaMaxima: 10,
  ponderacion: 30,
}

describe("evaluaciones API", () => {
  beforeEach(() => {
    createSupabaseBrowserClientMock.mockReset()
  })

  it("getEvaluaciones calcula promedio y rendidas", async () => {
    const result = await getEvaluaciones(
      createFakeSupabase({
        evaluaciones: [
          {
            id: "ev1",
            titulo: "Parcial",
            tipo: "sumativa",
            fecha: "2026-06-01",
            ponderacion: 30,
            nota_maxima: 10,
            catedra_id: "c1",
            catedras: { codigo: "C-01", cursos: { nombre: "Guitarra" } },
            calificaciones: [{ nota: 8 }, { nota: 6 }, { nota: null }],
          },
          {
            id: "ev2",
            titulo: "Sin notas",
            tipo: "formativa",
            fecha: null,
            ponderacion: null,
            nota_maxima: null,
            catedra_id: "c1",
            catedras: null,
            calificaciones: [],
          },
        ],
      }),
    )

    expect(result.data![0]).toMatchObject({ catedra: "C-01", curso: "Guitarra", promedio: 7, rendidas: 2 })
    expect(result.data![1]).toMatchObject({ catedra: "Sin cátedra", curso: "—", promedio: null, rendidas: 0 })
  })

  it("getCalificacionesEvaluacion combina inscripciones y notas", async () => {
    const result = await getCalificacionesEvaluacion(
      "ev1",
      createFakeSupabase({
        evaluaciones: [
          {
            id: "ev1",
            catedra_id: "c1",
            titulo: "Parcial",
            tipo: "sumativa",
            nota_maxima: 10,
            ponderacion: 30,
            fecha: "2026-06-01",
            catedras: { codigo: "C-01", cursos: { nombre: "Guitarra" } },
          },
        ],
        inscripciones: [
          { id: "i1", catedra_id: "c1", estado: "activa", estudiante_id: "e1", estudiantes: { id: "e1", nombres: "Ada", apellidos: "Lovelace" } },
          { id: "i2", catedra_id: "c1", estado: "activa", estudiante_id: "e2", estudiantes: null },
        ],
        calificaciones: [{ evaluacion_id: "ev1", inscripcion_id: "i1", nota: 9, observacion: null, calificada_en: "2026-06-02" }],
      }),
    )

    expect(result.data).toMatchObject({ evaluacionId: "ev1", codigo: "C-01", curso: "Guitarra" })
    expect(result.data!.estudiantes[0]).toMatchObject({ estudiante: "Ada Lovelace", nota: 9 })
    expect(result.data!.estudiantes[1]).toMatchObject({ estudiante: "Estudiante", nota: null })
  })

  it("getCalificacionesEvaluacion propaga error de evaluación", async () => {
    const result = await getCalificacionesEvaluacion("missing", createFakeSupabase({ evaluaciones: [] }))

    expect(result.data).toBeNull()
    expect(result.error).toBeTruthy()
  })

  it("crearEvaluacion y eliminarEvaluacion responden", async () => {
    configure({ evaluaciones: [{ id: "ev1" }] })

    await expect(crearEvaluacion(EVALUACION_VALUES)).resolves.toEqual({ data: { id: expect.any(String) }, error: null })
    await expect(eliminarEvaluacion("ev1")).resolves.toEqual({ error: null })
  })

  it("getCatedrasOptions lista solo planificadas/en curso", async () => {
    const result = await getCatedrasOptions(
      createFakeSupabase({
        catedras: [
          { id: "c1", codigo: "C-01", estado: "en_curso", cursos: { nombre: "Guitarra" } },
          { id: "c2", codigo: "C-02", estado: "finalizada", cursos: null },
        ],
      }),
    )

    expect(result.data).toEqual([{ id: "c1", label: "C-01 · Guitarra" }])
  })

  it("guardarCalificaciones omite nulos y hace upsert", async () => {
    const fake = configure({ calificaciones: [] })
    const calls: string[] = []
    const original = fake.from.bind(fake) as (table: string) => unknown
    fake.from = ((table: string) => {
      calls.push(table)
      return original(table)
    }) as unknown as typeof fake.from

    await expect(
      guardarCalificaciones("ev1", [
        { inscripcionId: "i1", nota: 8, observacion: " " },
        { inscripcionId: "i2", nota: null },
      ]),
    ).resolves.toEqual({ error: null })
    expect(calls).toEqual(["calificaciones"])

    const fake2 = configure({ calificaciones: [] })
    const calls2: string[] = []
    const original2 = fake2.from.bind(fake2) as (table: string) => unknown
    fake2.from = ((table: string) => {
      calls2.push(table)
      return original2(table)
    }) as unknown as typeof fake2.from

    await expect(guardarCalificaciones("ev1", [{ inscripcionId: "i1", nota: null }])).resolves.toEqual({ error: null })
    expect(calls2).toEqual([])
  })

  it("propaga errores de escritura", async () => {
    createSupabaseBrowserClientMock.mockReturnValue(createFakeSupabase.withError("evaluaciones", "boom", {}, { user: { id: "u1" } }))

    await expect(crearEvaluacion(EVALUACION_VALUES)).resolves.toEqual({ data: null, error: "boom" })
    await expect(eliminarEvaluacion("ev1")).resolves.toEqual({ error: "boom" })
  })
})
