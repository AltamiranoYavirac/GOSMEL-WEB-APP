import { beforeEach, describe, expect, it } from "vitest"

const { createSupabaseBrowserClientMock } = vi.hoisted(() => ({
  createSupabaseBrowserClientMock: vi.fn(),
}))

vi.mock("@/shared/api/supabase/client", () => ({
  createSupabaseBrowserClient: createSupabaseBrowserClientMock,
}))

import { createFakeSupabase } from "@/test/supabase"
import type { TFakeSupabaseClient } from "@/test/supabase.types"

import { createDocente } from "./createDocente"
import { eliminarDocente } from "./eliminarDocente"
import { getDocenteDetalle } from "./getDocenteDetalle"
import { getDocentes } from "./getDocentes"
import { getPerfilesDisponibles } from "./getPerfilesDisponibles"
import { reemplazarInstrumentosDocente } from "./reemplazarInstrumentosDocente"
import { updateDocente } from "./updateDocente"

function configure(tables: Record<string, Record<string, unknown>[]> = {}): TFakeSupabaseClient {
  const fake = createFakeSupabase(tables)
  createSupabaseBrowserClientMock.mockReturnValue(fake)
  return fake
}

describe("docentes read APIs", () => {
  beforeEach(() => {
    createSupabaseBrowserClientMock.mockReset()
  })

  it("getDocentes mapea perfiles e instrumentos solo con rol docente", async () => {
    const result = await getDocentes(
      createFakeSupabase({
        perfil_rol: [
          { perfil_id: "p1", rol: "docente" },
          { perfil_id: "p2", rol: "estudiante" },
        ],
        docentes: [
          {
            perfil_id: "p1",
            titulo_profesional: "Maestro",
            anios_experiencia: 10,
            destacado: true,
            publicado: true,
            perfiles: { nombres: "Leo", apellidos: "Brouwer", email: "leo@x.com" },
            docente_instrumento: [{ instrumentos: { nombre: "Guitarra" } }],
          },
          {
            perfil_id: "p2",
            titulo_profesional: null,
            anios_experiencia: null,
            destacado: false,
            publicado: false,
            perfiles: null,
            docente_instrumento: [],
          },
        ],
      }),
    )

    expect(result.data).toHaveLength(1)
    expect(result.data![0]).toMatchObject({
      id: "p1",
      nombre: "Leo Brouwer",
      instrumentos: ["Guitarra"],
      aniosExperiencia: 10,
    })
  })

  it("getDocenteDetalle mapea colecciones y cátedras", async () => {
    const result = await getDocenteDetalle(
      "p1",
      createFakeSupabase({
        docentes: [
          {
            perfil_id: "p1",
            slug: "leo-brouwer",
            titulo_profesional: "Maestro",
            biografia: "Bio",
            frase_destacada: "Frase",
            anios_experiencia: 10,
            redes_sociales: { instagram: "@leo" },
            destacado: true,
            publicado: true,
            perfiles: { nombres: "Leo", apellidos: "Brouwer", email: "leo@x.com" },
            docente_instrumento: [
              { instrumento_id: "i1", es_principal: true, instrumentos: { nombre: "Guitarra" } },
              { instrumento_id: "i2", es_principal: false, instrumentos: { nombre: "Piano" } },
            ],
          },
        ],
        docente_formacion: [{ id: "f1", docente_id: "p1", institucion: "Conservatorio", titulo: "Título", anio_inicio: 2000, anio_fin: 2005, descripcion: null }],
        docente_reconocimientos: [{ id: "r1", docente_id: "p1", titulo: "Premio", anio: 2010, entidad_otorgante: null, descripcion: null }],
        docente_portafolio: [{ id: "pf1", docente_id: "p1", tipo: "video", titulo: "Concierto", url_externa: "https://v.com" }],
        catedras: [{ id: "c1", docente_id: "p1", codigo: "C-01", modalidad: "presencial", estado: "en_curso", cursos: { nombre: "Guitarra" } }],
      }),
    )

    expect(result.data).toMatchObject({
      nombre: "Leo Brouwer",
      slug: "leo-brouwer",
      fraseDestacada: "Frase",
      redesSociales: { instagram: "@leo" },
      instrumentos: ["Guitarra", "Piano"],
      instrumentoIds: ["i1", "i2"],
      instrumentoPrincipalId: "i1",
    })
    expect(result.data!.formacion[0]).toMatchObject({ id: "f1", anioInicio: 2000 })
    expect(result.data!.reconocimientos[0].titulo).toBe("Premio")
    expect(result.data!.portafolio[0]).toMatchObject({ tipo: "video", titulo: "Concierto" })
    expect(result.data!.catedras[0]).toMatchObject({ codigo: "C-01", curso: "Guitarra" })
  })

  it("getDocenteDetalle devuelve null si no existe", async () => {
    const result = await getDocenteDetalle("missing", createFakeSupabase({ docentes: [] }))

    expect(result).toEqual({ data: null, error: null })
  })

  it("getPerfilesDisponibles excluye docentes y estudiantes", async () => {
    const result = await getPerfilesDisponibles(
      createFakeSupabase({
        perfiles: [
          { id: "p1", nombres: "Ada", apellidos: "Lovelace", email: "ada@x.com" },
          { id: "p2", nombres: "Leo", apellidos: "Brouwer", email: "leo@x.com" },
          { id: "p3", nombres: "Alan", apellidos: "Turing", email: "alan@x.com" },
        ],
        docentes: [{ perfil_id: "p2" }],
        estudiantes: [{ perfil_id: "p3" }],
      }),
    )

    expect(result.data).toEqual([{ id: "p1", nombre: "Ada Lovelace", email: "ada@x.com" }])
  })
})

describe("docentes write APIs", () => {
  beforeEach(() => {
    createSupabaseBrowserClientMock.mockReset()
  })

  it("createDocente registra ficha, rol e instrumento vía RPC", async () => {
    const rpc = vi.fn((args: { p_perfil_id: string }) => args.p_perfil_id)
    createSupabaseBrowserClientMock.mockReturnValue(
      createFakeSupabase({}, { rpcResults: { registrar_docente: rpc } }),
    )

    const result = await createDocente({
      perfil_id: "p1",
      slug: "  Leo-Brouwer  ",
      titulo_profesional: " Maestro ",
      biografia: "",
      anios_experiencia: 10,
      publicado: true,
      destacado: false,
      instrumento_ids: ["i1", "i2"],
      instrumento_principal_id: "i1",
    })

    expect(result).toEqual({ data: { perfil_id: "p1" }, error: null })
    expect(rpc).toHaveBeenCalledWith({
      p_perfil_id: "p1",
      p_slug: "leo-brouwer",
      p_titulo_profesional: "Maestro",
      p_biografia: undefined,
      p_frase_destacada: undefined,
      p_anios_experiencia: 10,
      p_publicado: true,
      p_destacado: false,
      p_instrumento_ids: ["i1", "i2"],
      p_instrumento_principal_id: "i1",
    })
  })

  it("createDocente propaga error de inserción", async () => {
    createSupabaseBrowserClientMock.mockReturnValue(
      createFakeSupabase.withError("rpc:registrar_docente", "boom"),
    )

    const result = await createDocente({ perfil_id: "p1", slug: "leo" })

    expect(result).toEqual({ data: null, error: "boom" })
  })

  it("reemplazarInstrumentosDocente llama al rpc con los instrumentos", async () => {
    const rpc = vi.fn()
    createSupabaseBrowserClientMock.mockReturnValue(
      createFakeSupabase({}, { rpcResults: { reemplazar_instrumentos_docente: rpc } }),
    )

    await expect(
      reemplazarInstrumentosDocente({ docenteId: "p1", instrumentoIds: ["i1"], instrumentoPrincipalId: "i1" }),
    ).resolves.toEqual({ error: null })

    expect(rpc).toHaveBeenCalledWith({
      p_docente_id: "p1",
      p_instrumento_ids: ["i1"],
      p_instrumento_principal_id: "i1",
    })
  })

  it("reemplazarInstrumentosDocente propaga errores", async () => {
    createSupabaseBrowserClientMock.mockReturnValue(
      createFakeSupabase.withError("rpc:reemplazar_instrumentos_docente", "boom"),
    )

    await expect(
      reemplazarInstrumentosDocente({ docenteId: "p1", instrumentoIds: [] }),
    ).resolves.toEqual({ error: "boom" })
  })

  it("updateDocente responde con perfil_id", async () => {
    configure({ docentes: [{ perfil_id: "p1" }] })

    await expect(updateDocente("p1", { titulo_profesional: "Maestro" })).resolves.toEqual({
      data: { perfil_id: "p1" },
      error: null,
    })
  })

  it("eliminarDocente despublica si tiene cátedras y borra si no", async () => {
    configure({ catedras: [{ id: "c1", docente_id: "p1" }], perfil_rol: [], docentes: [{ perfil_id: "p1" }] })
    await expect(eliminarDocente("p1")).resolves.toEqual({ data: { deleted: false }, error: null })

    configure({
      catedras: [],
      perfil_rol: [],
      docentes: [{ perfil_id: "p1" }],
      docente_formacion: [],
      docente_reconocimientos: [],
      docente_portafolio: [],
      docente_instrumento: [],
    })
    await expect(eliminarDocente("p1")).resolves.toEqual({ data: { deleted: true }, error: null })
  })

  it("eliminarDocente propaga error de cátedras", async () => {
    createSupabaseBrowserClientMock.mockReturnValue(createFakeSupabase.withError("catedras", "boom"))

    await expect(eliminarDocente("p1")).resolves.toEqual({ data: null, error: "boom" })
  })
})
