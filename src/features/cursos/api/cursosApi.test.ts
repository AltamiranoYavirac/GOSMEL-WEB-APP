import { beforeEach, describe, expect, it, vi } from "vitest"

const { createSupabaseBrowserClientMock } = vi.hoisted(() => ({
  createSupabaseBrowserClientMock: vi.fn(),
}))

vi.mock("@/shared/api/supabase/client", () => ({
  createSupabaseBrowserClient: createSupabaseBrowserClientMock,
}))

import { createFakeSupabase } from "@/test/supabase"
import type { TFakeSupabaseClient, TFakeTables } from "@/test/supabase.types"

import { crearCurso } from "./crearCurso"
import { crearLeccion } from "./crearLeccion"
import { crearModulo } from "./crearModulo"
import { eliminarCurso } from "./eliminarCurso"
import { eliminarLeccion } from "./eliminarLeccion"
import { eliminarModulo } from "./eliminarModulo"
import { getCursoById } from "./getCursoById"
import { getCursoGuia } from "./getCursoGuia"
import { crearHabilidad, eliminarHabilidad, getCursoHabilidades } from "./getCursoHabilidades"
import { getCursoOptions } from "./getCursoOptions"
import { getCursos } from "./getCursos"
import { updateCurso } from "./updateCurso"
import { updateLeccion } from "./updateLeccion"
import { updateModulo } from "./updateModulo"

function client(tables: TFakeTables = {}): TFakeSupabaseClient {
  return createFakeSupabase(tables)
}

function configure(tables: TFakeTables = {}): TFakeSupabaseClient {
  const fake = client(tables)
  createSupabaseBrowserClientMock.mockReturnValue(fake)
  return fake
}

function instrument(fake: TFakeSupabaseClient): string[] {
  const calls: string[] = []
  const original = fake.from.bind(fake) as (table: string) => unknown
  fake.from = ((table: string) => {
    calls.push(table)
    return original(table)
  }) as unknown as typeof fake.from
  return calls
}

const MODULO_VALUES = { titulo: "Módulo", descripcion: " desc ", orden: 1 }
const LECCION_VALUES = { titulo: "Lección", descripcion: " desc ", duracionMinutos: 15, esMuestra: true, orden: 2 }

describe("cursos read APIs", () => {
  beforeEach(() => {
    createSupabaseBrowserClientMock.mockReset()
  })

  it("getCursos mapea instrumento, rating y módulos", async () => {
    const result = await getCursos(
      client({
        cursos: [
          {
            id: "k1",
            nombre: "Guitarra",
            nivel: "basico",
            modalidad: "presencial",
            instrumento_id: "i1",
            instrumentos: { nombre: "Guitarra clásica" },
            puntuacion_promedio: 4.5,
            total_resenas: 10,
            publicado: true,
            destacado: false,
            curso_modulos: [{ id: "m1" }, { id: "m2" }],
          },
        ],
      }),
    )

    expect(result.data![0]).toMatchObject({
      instrumento: "Guitarra clásica",
      rating: 4.5,
      totalResenas: 10,
      modulos: 2,
    })
  })

  it("getCursos propaga error", async () => {
    const result = await getCursos(createFakeSupabase.withError("cursos", "boom"))

    expect(result).toEqual({ data: null, error: "boom" })
  })

  it("getCursoById mapea strings y defaults", async () => {
    const result = await getCursoById(
      "k1",
      client({
        cursos: [
          {
            id: "k1",
            nombre: "Guitarra",
            resumen: null,
            descripcion: null,
            nivel: null,
            modalidad: null,
            duracion_semanas: 12,
            horas_totales: null,
            precio_referencial: 45,
            etiqueta_precio: null,
            mostrar_precio: null,
            portada_public_id: null,
            publicado: null,
            destacado: null,
            orden: 4,
          },
        ],
      }),
    )

    expect(result.data).toMatchObject({
      nombre: "Guitarra",
      resumen: "",
      nivel: "basico",
      modalidad: "presencial",
      duracionSemanas: "12",
      horasTotales: "",
      precioReferencial: "45",
      mostrarPrecio: false,
      orden: 4,
    })
  })

  it("getCursoById devuelve error si no existe", async () => {
    const result = await getCursoById("missing", client({ cursos: [] }))

    expect(result.data).toBeNull()
    expect(result.error).toBeTruthy()
  })

  it("getCursoOptions trae instrumentos y sugiere el siguiente orden", async () => {
    const fake = configure({
      cursos: [{ id: "k1", orden: 7 }],
      instrumentos: [{ id: "i1", nombre: "Guitarra", activo: true }],
    })

    const result = await getCursoOptions(fake)

    expect(result.error).toBeNull()
    expect(result.data).toEqual({
      instrumentos: [{ id: "i1", nombre: "Guitarra" }],
      nextOrden: 8,
    })
  })

  it("getCursoGuia ordena módulos y lecciones", async () => {
    const result = await getCursoGuia(
      "k1",
      client({
        cursos: [
          {
            id: "k1",
            nombre: "Guitarra",
            descripcion: "Desc",
            resumen: "Res",
            nivel: "basico",
            modalidad: "presencial",
            duracion_semanas: 12,
            horas_totales: 24,
            curso_modulos: [
              {
                id: "m2",
                orden: 2,
                titulo: "Dos",
                descripcion: null,
                curso_lecciones: [{ id: "l2", orden: 2, titulo: "B", descripcion: null, duracion_minutos: 20 }],
              },
              {
                id: "m1",
                orden: 1,
                titulo: "Uno",
                descripcion: null,
                curso_lecciones: [
                  { id: "l1", orden: 2, titulo: "B", descripcion: null, duracion_minutos: 20 },
                  { id: "l0", orden: 1, titulo: "A", descripcion: null, duracion_minutos: 10 },
                ],
              },
            ],
            catedras: [
              {
                id: "c1",
                codigo: "C-01",
                estado: "en_curso",
                modalidad: "presencial",
                docente_id: "p1",
                docentes: { perfiles: { nombres: "Leo", apellidos: "Brouwer" } },
              },
            ],
          },
        ],
      }),
    )

    expect(result.data!.modulos.map((m) => m.id)).toEqual(["m1", "m2"])
    expect(result.data!.modulos[0].lecciones.map((l) => l.id)).toEqual(["l0", "l1"])
    expect(result.data!.catedras[0].docente).toBe("Leo Brouwer")
  })

  it("getCursoGuia devuelve null sin fila", async () => {
    expect(await getCursoGuia("missing", client({ cursos: [] }))).toEqual({ data: null, error: null })
  })

  it("gestiona habilidades del curso", async () => {
    const list = await getCursoHabilidades(
      "k1",
      client({ curso_habilidades: [{ id: "h1", curso_id: "k1", habilidad: "Ritmo", orden: 1 }] }),
    )
    expect(list.data![0]).toEqual({ id: "h1", cursoId: "k1", habilidad: "Ritmo", orden: 1 })

    configure()
    await expect(crearHabilidad("k1", "  Escalas  ", 3)).resolves.toEqual({
      data: { id: expect.any(String) },
      error: null,
    })
    await expect(eliminarHabilidad("h1")).resolves.toEqual({ error: null })

    createSupabaseBrowserClientMock.mockReturnValue(createFakeSupabase.withError("curso_habilidades", "boom"))
    await expect(eliminarHabilidad("h1")).resolves.toEqual({ error: "boom" })
  })
})

describe("cursos write APIs", () => {
  beforeEach(() => {
    createSupabaseBrowserClientMock.mockReset()
  })

  it("crearCurso resuelve colisión de slug en la operación remota", async () => {
    const fake = createFakeSupabase(
      { cursos: [{ id: "k0", nombre: "Guitarra", slug: "guitarra" }] },
      { rpcResults: { crear_curso_con_catedra: "k1" } },
    )
    createSupabaseBrowserClientMock.mockReturnValue(fake)

    const result = await crearCurso({
      nombre: "Guitarra",
      descripcion: "Curso de guitarra",
      resumen: "Resumen",
      categoria: "instrumento",
      nivel: "basico",
      modalidad: "presencial",
      instrumentoId: "i1",
      duracionPermanente: false,
      duracionSemanas: 12,
      horasTotales: 24,
      mostrarPrecio: false,
      publicado: false,
      orden: 4,
      portadaTextoAlt: "Portada de guitarra",
    }, "gosmel/cursos/portada")

    expect(result).toEqual({ data: { id: "k1" }, error: null })
  })

  it("crearCurso admite un nombre sin caracteres para slug", async () => {
    const fake = createFakeSupabase({ cursos: [] }, { rpcResults: { crear_curso_con_catedra: "k2" } })
    createSupabaseBrowserClientMock.mockReturnValue(fake)

    await expect(crearCurso({
      nombre: "¡!",
      descripcion: "Descripción larga",
      resumen: "",
      categoria: "otro",
      nivel: "basico",
      modalidad: "virtual",
      instrumentoId: "",
      orden: 1,
      duracionPermanente: true,
      duracionSemanas: null,
      horasTotales: null,
      mostrarPrecio: false,
      publicado: false,
      portadaTextoAlt: "",
    })).resolves.toEqual({ data: { id: "k2" }, error: null })
  })

  it("crearCurso propaga el error de la operación remota", async () => {
    createSupabaseBrowserClientMock.mockReturnValue(createFakeSupabase({}, { rpcError: "boom curso" }))

    await expect(crearCurso({
      nombre: "Curso",
      descripcion: "Descripción larga",
      resumen: "",
      categoria: "otro",
      nivel: "basico",
      modalidad: "virtual",
      instrumentoId: "",
      orden: 1,
      duracionPermanente: true,
      duracionSemanas: null,
      horasTotales: null,
      mostrarPrecio: false,
      publicado: false,
      portadaTextoAlt: "",
    })).resolves.toEqual({ data: null, error: "boom curso" })
  })

  it("updateCurso responde con id", async () => {
    configure({ cursos: [{ id: "k1" }] })

    await expect(updateCurso("k1", { nombre: "Nuevo" })).resolves.toEqual({
      data: { id: "k1" },
      error: null,
    })
  })

  it("eliminarCurso bloquea si hay matrículas activas", async () => {
    configure({
      cursos: [{ id: "k1", portada_public_id: null, galeria_medios: [] }],
      catedras: [{ id: "c1", curso_id: "k1", inscripciones: [{ id: "i1", estado: "activa" }] }],
    })

    const result = await eliminarCurso("k1")

    expect(result.error).toContain("1 matrícula(s) activa(s)")
    expect(result.error).toContain("No se puede eliminar el curso")
  })

  it("eliminarCurso borra en cascada", async () => {
    const fake = configure({
      cursos: [{ id: "k1", portada_public_id: "gosmel/cursos/portada", galeria_medios: [] }],
      catedras: [{ id: "c1", curso_id: "k1", inscripciones: [{ id: "i1", estado: "finalizada" }] }],
      curso_modulos: [{ id: "m1", curso_id: "k1" }],
    })
    const calls = instrument(fake)

    await expect(eliminarCurso("k1")).resolves.toEqual({
      data: { publicIds: ["gosmel/cursos/portada"] },
      error: null,
    })

    expect(calls).toEqual([
      "cursos",
      "catedras",
      "curso_habilidades",
      "programa_curso",
      "curso_modulos",
      "curso_lecciones",
      "curso_modulos",
      "sesiones",
      "catedra_horarios",
      "catedras",
      "cursos",
    ])
  })

  it("eliminarCurso propaga error al listar cátedras", async () => {
    createSupabaseBrowserClientMock.mockReturnValue(
      createFakeSupabase.withError("catedras", "boom catedras", {
        cursos: [{ id: "k1", portada_public_id: null, galeria_medios: [] }],
      }),
    )

    await expect(eliminarCurso("k1")).resolves.toEqual({ data: null, error: "boom catedras" })
  })

  it("gestiona módulos y lecciones", async () => {
    configure({ curso_modulos: [{ id: "m1" }], curso_lecciones: [{ id: "l1" }] })

    await expect(crearModulo("k1", MODULO_VALUES)).resolves.toEqual({ data: { id: expect.any(String) }, error: null })
    await expect(updateModulo("m1", MODULO_VALUES)).resolves.toEqual({ data: { id: "m1" }, error: null })
    await expect(eliminarModulo("m1")).resolves.toEqual({ error: null })
    await expect(crearLeccion("m1", LECCION_VALUES)).resolves.toEqual({ data: { id: expect.any(String) }, error: null })
    await expect(updateLeccion("l1", LECCION_VALUES)).resolves.toEqual({ data: { id: "l1" }, error: null })
    await expect(eliminarLeccion("l1")).resolves.toEqual({ error: null })
  })

  it("propaga errores de módulos y lecciones", async () => {
    configure()

    createSupabaseBrowserClientMock.mockReturnValueOnce(
      createFakeSupabase.withError("curso_modulos", "boom modulos"),
    )
    await expect(crearModulo("k1", MODULO_VALUES)).resolves.toEqual({ data: null, error: "boom modulos" })

    createSupabaseBrowserClientMock.mockReturnValueOnce(
      createFakeSupabase.withError("curso_lecciones", "boom lecciones"),
    )
    await expect(updateLeccion("l1", LECCION_VALUES)).resolves.toEqual({ data: null, error: "boom lecciones" })
  })
})
