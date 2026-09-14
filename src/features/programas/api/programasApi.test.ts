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
import {
  asociarCursoPrograma,
  desasociarCursoPrograma,
  getProgramaDetalle,
  updateOrdenCursoPrograma,
} from "./getProgramaDetalle"
import { getProgramaOptions } from "./getProgramaOptions"
import { getProgramas } from "./getProgramas"
import { agregarObjetivoPrograma, eliminarObjetivoPrograma, updateOrdenObjetivoPrograma } from "./programaObjetivos"
import { updatePrograma } from "./updatePrograma"
import { updateProgramaPublicado } from "./updateProgramaPublicado"

function configure(tables: Record<string, Record<string, unknown>[]> = {}): TFakeSupabaseClient {
  const fake = createFakeSupabase(tables)
  createSupabaseBrowserClientMock.mockReturnValue(fake)
  return fake
}

const PROGRAMA_VALUES = {
  nombre: " Programa Integral ",
  descripcion: " desc ",
  nivel: "intermedio" as const,
  imagenPublicId: "gosmel/programas/integral",
  imagenArchivo: null,
  quitarImagen: false,
  imagenTextoAlt: "Estudiantes del programa integral",
  precioReferencial: 150,
  etiquetaPrecio: "$150 / mes",
  mostrarPrecio: true,
  publicado: true,
  orden: 1,
}

describe("programas API", () => {
  beforeEach(() => {
    createSupabaseBrowserClientMock.mockReset()
  })

  it("getProgramas deriva el instrumento de los cursos vinculados", async () => {
    const result = await getProgramas(
      createFakeSupabase({
        programas: [
          {
            id: "pg1",
            nombre: "Integral",
            nivel: "intermedio",
            publicado: true,
            programa_curso: [
              { cursos: { instrumentos: { nombre: "Guitarra", tipos_instrumento: { nombre: "Cuerda Pulsada" } } } },
              { cursos: { instrumentos: { nombre: "Guitarra", tipos_instrumento: { nombre: "Cuerda Pulsada" } } } },
            ],
          },
          {
            id: "pg2",
            nombre: "Banda",
            nivel: null,
            publicado: false,
            programa_curso: [
              { cursos: { instrumentos: { nombre: "Guitarra", tipos_instrumento: { nombre: "Cuerda Pulsada" } } } },
              { cursos: { instrumentos: { nombre: "Batería", tipos_instrumento: { nombre: "Percusión" } } } },
            ],
          },
          {
            id: "pg3",
            nombre: "Libre",
            nivel: null,
            publicado: false,
            programa_curso: [],
          },
          {
            id: "pg4",
            nombre: "Cuerdas",
            nivel: null,
            publicado: false,
            programa_curso: [
              { cursos: { instrumentos: { nombre: "Guitarra Clásica", tipos_instrumento: { nombre: "Cuerda Pulsada" } } } },
              { cursos: { instrumentos: { nombre: "Guitarra Eléctrica", tipos_instrumento: { nombre: "Cuerda Pulsada" } } } },
              { cursos: { instrumentos: { nombre: "Charango", tipos_instrumento: { nombre: "Cuerda Pulsada" } } } },
            ],
          },
          {
            id: "pg5",
            nombre: "Mixto",
            nivel: null,
            publicado: false,
            programa_curso: [
              { cursos: { instrumentos: { nombre: "Guitarra", tipos_instrumento: { nombre: "Cuerda Pulsada" } } } },
              { cursos: { instrumentos: null } },
            ],
          },
        ],
      }),
    )

    expect(result.data![0]).toMatchObject({ nombre: "Banda", instrumento: "Multidisciplinario", numCursos: 2 })
    expect(result.data![1]).toMatchObject({ nombre: "Cuerdas", instrumento: "Cuerda Pulsada", numCursos: 3 })
    expect(result.data![2]).toMatchObject({ nombre: "Integral", instrumento: "Guitarra", numCursos: 2 })
    expect(result.data![3]).toMatchObject({ nombre: "Libre", instrumento: null, numCursos: 0 })
    expect(result.data![4]).toMatchObject({ nombre: "Mixto", instrumento: "Multidisciplinario", numCursos: 2 })
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
            nivel: "intermedio",
            publicado: true,
            orden: 1,
            programa_curso: [
              { orden: 2, cursos: { id: "k2", nombre: "Avanzado", nivel: "avanzado", modalidad: "virtual" } },
              { orden: 1, cursos: { id: "k1", nombre: "Básico", nivel: "basico", modalidad: "presencial" } },
              { orden: 3, cursos: null },
            ],
            programa_objetivos: [
              { id: "o2", objetivo: "Segundo", orden: 2 },
              { id: "o1", objetivo: "Primero", orden: 1 },
            ],
          },
        ],
      }),
    )

    expect(result.data!.cursos.map((curso) => curso.cursoId)).toEqual(["k1", "k2"])
    expect(result.data!.objetivos.map((item) => item.objetivo)).toEqual(["Primero", "Segundo"])
  })

  it("getProgramaDetalle devuelve null sin fila y gestiona asociaciones", async () => {
    expect(await getProgramaDetalle("missing", createFakeSupabase({ programas: [] }))).toEqual({ data: null, error: null })

    configure({ programa_curso: [] })
    await expect(asociarCursoPrograma("pg1", "k1", 2)).resolves.toEqual({ error: null })
    await expect(desasociarCursoPrograma("pg1", "k1")).resolves.toEqual({ error: null })
  })

  it("getProgramaOptions lista todos los cursos", async () => {
    const result = await getProgramaOptions(
      createFakeSupabase({
        cursos: [
          { id: "k1", nombre: "Guitarra", publicado: true },
          { id: "k2", nombre: "Piano", publicado: false },
        ],
      }),
    )

    expect(result.data!.cursos).toEqual([
      { id: "k1", nombre: "Guitarra" },
      { id: "k2", nombre: "Piano" },
    ])
  })

  it("crearPrograma y updatePrograma responden id", async () => {
    configure({ programas: [{ id: "pg1" }] })

    await expect(crearPrograma(PROGRAMA_VALUES)).resolves.toEqual({ data: { id: expect.any(String) }, error: null })
    await expect(updatePrograma("pg1", PROGRAMA_VALUES)).resolves.toEqual({ data: { id: "pg1" }, error: null })
  })

  it("crearPrograma resuelve colisión de slug de forma secuencial", async () => {
    const tables = { programas: [{ id: "pg1", slug: "programa-integral" }] }
    configure(tables)

    await crearPrograma(PROGRAMA_VALUES)
    expect(tables.programas[1].slug).toBe("programa-integral-2")
  })

  it("updateProgramaPublicado exige imagen y etiqueta de precio al publicar", async () => {
    configure({
      programas: [
        { id: "pg1", imagen_public_id: null, mostrar_precio: false, etiqueta_precio: null },
        { id: "pg2", imagen_public_id: "gosmel/programas/x", mostrar_precio: false, etiqueta_precio: null },
        { id: "pg3", imagen_public_id: "gosmel/programas/y", mostrar_precio: true, etiqueta_precio: null },
      ],
    })

    const blocked = await updateProgramaPublicado("pg1", true)
    expect(blocked).toEqual({ data: null, error: expect.stringContaining("imagen") })
    const blockedPrecio = await updateProgramaPublicado("pg3", true)
    expect(blockedPrecio).toEqual({ data: null, error: expect.stringContaining("etiqueta") })
    await expect(updateProgramaPublicado("pg2", true)).resolves.toEqual({ data: { id: "pg2" }, error: null })
    await expect(updateProgramaPublicado("pg1", false)).resolves.toEqual({ data: { id: "pg1" }, error: null })
  })

  it("updateOrdenCursoPrograma actualiza el orden del vínculo", async () => {
    const tables = { programa_curso: [{ programa_id: "pg1", curso_id: "k1", orden: 0 }] }
    configure(tables)

    await expect(updateOrdenCursoPrograma("pg1", "k1", 3)).resolves.toEqual({ error: null })
    expect(tables.programa_curso[0].orden).toBe(3)
  })

  it("gestiona objetivos del programa", async () => {
    const tables = { programa_objetivos: [{ id: "o1", programa_id: "pg1", objetivo: "Base", orden: 0 }] }
    configure(tables)

    const added = await agregarObjetivoPrograma("pg1", "  Nuevo objetivo  ", 1)
    expect(added.data).toEqual({ id: expect.any(String) })
    expect(tables.programa_objetivos[1].objetivo).toBe("Nuevo objetivo")

    await expect(updateOrdenObjetivoPrograma("o1", 2)).resolves.toEqual({ error: null })
    expect(tables.programa_objetivos[0].orden).toBe(2)

    await expect(eliminarObjetivoPrograma("o1")).resolves.toEqual({ error: null })
    expect(tables.programa_objetivos).toHaveLength(1)
  })

  it("propaga errores", async () => {
    createSupabaseBrowserClientMock.mockReturnValue(createFakeSupabase.withError("programas", "boom"))

    await expect(crearPrograma(PROGRAMA_VALUES)).resolves.toEqual({ data: null, error: "boom" })
    await expect(getProgramas(createFakeSupabase.withError("programas", "boom"))).resolves.toEqual({ data: null, error: "boom" })
  })
})
