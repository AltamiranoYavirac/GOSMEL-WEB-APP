import { beforeEach, describe, expect, it } from "vitest"

const { createSupabaseBrowserClientMock } = vi.hoisted(() => ({
  createSupabaseBrowserClientMock: vi.fn(),
}))

vi.mock("@/shared/api/supabase/client", () => ({
  createSupabaseBrowserClient: createSupabaseBrowserClientMock,
}))

import { createFakeSupabase } from "@/test/supabase"
import type { TFakeSupabaseClient } from "@/test/supabase.types"

import { crearPrograma } from "./crearPrograma"
import { asociarCursoPrograma, desasociarCursoPrograma, getProgramaDetalle } from "./getProgramaDetalle"
import { getProgramaOptions } from "./getProgramaOptions"
import { getProgramas } from "./getProgramas"
import { updatePrograma } from "./updatePrograma"

function configure(tables: Record<string, Record<string, unknown>[]> = {}): TFakeSupabaseClient {
  const fake = createFakeSupabase(tables)
  createSupabaseBrowserClientMock.mockReturnValue(fake)
  return fake
}

const PROGRAMA_VALUES = {
  nombre: " Programa Integral ",
  descripcion: " desc ",
  objetivos: " obj ",
  instrumentoId: "i1",
  nivel: "intermedio" as const,
  publicado: true,
  orden: 1,
}

describe("programas API", () => {
  beforeEach(() => {
    createSupabaseBrowserClientMock.mockReset()
  })

  it("getProgramas mapea instrumento, nivel y número de cursos", async () => {
    const result = await getProgramas(
      createFakeSupabase({
        programas: [
          {
            id: "pg1",
            nombre: "Integral",
            nivel: "intermedio",
            instrumento_id: "i1",
            instrumentos: { nombre: "Guitarra" },
            publicado: true,
            programa_curso: [{ programa_id: "pg1" }, { programa_id: "pg1" }],
          },
          {
            id: "pg2",
            nombre: "Libre",
            nivel: null,
            instrumento_id: null,
            instrumentos: null,
            publicado: false,
            programa_curso: [],
          },
        ],
      }),
    )

    expect(result.data![0]).toMatchObject({ instrumento: "Guitarra", numCursos: 2 })
    expect(result.data![1]).toMatchObject({ instrumento: null, numCursos: 0 })
  })

  it("getProgramaDetalle ordena y filtra cursos vacíos", async () => {
    const result = await getProgramaDetalle(
      "pg1",
      createFakeSupabase({
        programas: [
          {
            id: "pg1",
            nombre: "Integral",
            slug: "integral",
            descripcion: "d",
            objetivos: "o",
            instrumento_id: "i1",
            nivel: "intermedio",
            publicado: true,
            orden: 1,
            instrumentos: { nombre: "Guitarra" },
            programa_curso: [
              { orden: 2, cursos: { id: "k2", nombre: "Avanzado", nivel: "avanzado", modalidad: "virtual" } },
              { orden: 1, cursos: { id: "k1", nombre: "Básico", nivel: "basico", modalidad: "presencial" } },
              { orden: 3, cursos: null },
            ],
          },
        ],
      }),
    )

    expect(result.data!.cursos.map((curso) => curso.cursoId)).toEqual(["k1", "k2"])
    expect(result.data!.instrumento).toBe("Guitarra")
  })

  it("getProgramaDetalle devuelve null sin fila y gestiona asociaciones", async () => {
    expect(await getProgramaDetalle("missing", createFakeSupabase({ programas: [] }))).toEqual({ data: null, error: null })

    configure({ programa_curso: [] })
    await expect(asociarCursoPrograma("pg1", "k1", 2)).resolves.toEqual({ error: null })
    await expect(desasociarCursoPrograma("pg1", "k1")).resolves.toEqual({ error: null })
  })

  it("getProgramaOptions filtra activos y publicados", async () => {
    const result = await getProgramaOptions(
      createFakeSupabase({
        instrumentos: [
          { id: "i1", nombre: "Guitarra", activo: true },
          { id: "i2", nombre: "Piano", activo: false },
        ],
        cursos: [
          { id: "k1", nombre: "Guitarra", publicado: true },
          { id: "k2", nombre: "Piano", publicado: false },
        ],
      }),
    )

    expect(result.data!.instrumentos).toEqual([{ id: "i1", nombre: "Guitarra" }])
    expect(result.data!.cursos).toEqual([{ id: "k1", nombre: "Guitarra" }])
  })

  it("crearPrograma y updatePrograma responden id", async () => {
    configure({ programas: [{ id: "pg1" }] })

    await expect(crearPrograma(PROGRAMA_VALUES)).resolves.toEqual({ data: { id: expect.any(String) }, error: null })
    await expect(updatePrograma("pg1", PROGRAMA_VALUES)).resolves.toEqual({ data: { id: "pg1" }, error: null })
  })

  it("propaga errores", async () => {
    createSupabaseBrowserClientMock.mockReturnValue(createFakeSupabase.withError("programas", "boom"))

    await expect(crearPrograma(PROGRAMA_VALUES)).resolves.toEqual({ data: null, error: "boom" })
    await expect(getProgramas(createFakeSupabase.withError("programas", "boom"))).resolves.toEqual({ data: null, error: "boom" })
  })
})
