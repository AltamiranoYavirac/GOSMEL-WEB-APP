import { beforeEach, describe, expect, it, vi } from "vitest"

const { createSupabaseBrowserClientMock } = vi.hoisted(() => ({
  createSupabaseBrowserClientMock: vi.fn(),
}))

vi.mock("@/shared/api/supabase/client", () => ({
  createSupabaseBrowserClient: createSupabaseBrowserClientMock,
}))

import { createFakeSupabase } from "@/test/supabase"
import type { TFakeSupabaseClient, TFakeTables } from "@/test/supabase.types"

import { createTeacherEvaluacion } from "./createTeacherEvaluacion"
import { createTeacherFormacion } from "./createTeacherFormacion"
import { createTeacherMaterial } from "./createTeacherMaterial"
import { createTeacherPortafolio } from "./createTeacherPortafolio"
import { createTeacherReconocimiento } from "./createTeacherReconocimiento"
import { createTeacherSesion } from "./createTeacherSesion"
import { deleteTeacherFormacion } from "./deleteTeacherFormacion"
import { deleteTeacherMaterial } from "./deleteTeacherMaterial"
import { deleteTeacherPortafolio } from "./deleteTeacherPortafolio"
import { deleteTeacherReconocimiento } from "./deleteTeacherReconocimiento"
import { getCursoTemario } from "./getCursoTemario"
import { getEstudianteAsistencias } from "./getEstudianteAsistencias"
import { getTeacherCatalogos } from "./getTeacherCatalogos"
import { getTeacherCatedras } from "./getTeacherCatedras"
import { getTeacherEstudiantes } from "./getTeacherEstudiantes"
import { getTeacherEvaluaciones } from "./getTeacherEvaluaciones"
import { getTeacherMateriales } from "./getTeacherMateriales"
import { getTeacherPerfil } from "./getTeacherPerfil"
import { getTeacherSesionAsistencia } from "./getTeacherSesionAsistencia"
import { getTeacherSesiones } from "./getTeacherSesiones"
import { guardarTeacherAsistencias } from "./guardarTeacherAsistencias"
import { guardarTeacherCalificaciones } from "./guardarTeacherCalificaciones"
import { updateTeacherInstrumentos } from "./updateTeacherInstrumentos"
import { updateTeacherPerfil } from "./updateTeacherPerfil"
import { updateTeacherSesionEstado } from "./updateTeacherSesionEstado"

const USER = { id: "u1", email: "docente@x.com" }

function clientWithTables(tables: TFakeTables = {}): TFakeSupabaseClient {
  return createFakeSupabase(tables, { user: USER })
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

function configureClient(fake: TFakeSupabaseClient) {
  createSupabaseBrowserClientMock.mockReturnValue(fake)
  return fake
}

describe("teacher-portal getters", () => {
  beforeEach(() => {
    createSupabaseBrowserClientMock.mockReset()
  })

  it("responden No autenticado sin usuario", async () => {
    const anonymous = createFakeSupabase({})

    await expect(getTeacherPerfil(anonymous)).resolves.toEqual({ data: null, error: "No autenticado" })
    await expect(getTeacherCatedras(anonymous)).resolves.toEqual({ data: null, error: "No autenticado" })
    await expect(getTeacherEstudiantes(anonymous)).resolves.toEqual({ data: null, error: "No autenticado" })
    await expect(getTeacherEvaluaciones(anonymous)).resolves.toEqual({ data: null, error: "No autenticado" })
    await expect(getTeacherMateriales(anonymous)).resolves.toEqual({ data: null, error: "No autenticado" })
    await expect(getTeacherCatalogos(anonymous)).resolves.toEqual({ data: null, error: "No autenticado" })
    await expect(getTeacherSesiones(anonymous)).resolves.toEqual({ data: null, error: "No autenticado" })
  })

  it("getTeacherPerfil mapea perfil docente, colecciones y redes", async () => {
    const result = await getTeacherPerfil(
      clientWithTables({
        docentes: [
          {
            perfil_id: "u1",
            titulo_profesional: "Maestro",
            biografia: "Bio",
            frase_destacada: "Frase",
            anios_experiencia: 12,
            redes_sociales: { instagram: "@leo" },
            perfiles: { nombres: "Leo", apellidos: "Brouwer", email: "leo@x.com" },
          },
        ],
        docente_formacion: [{ id: "f1", docente_id: "u1", institucion: "Conservatorio", titulo: "Título", anio_inicio: 2000, anio_fin: 2005, descripcion: null, orden: 0 }],
        docente_reconocimientos: [{ id: "r1", docente_id: "u1", titulo: "Premio", anio: 2010, entidad_otorgante: "X", descripcion: null, orden: 0 }],
        docente_portafolio: [{ id: "p1", docente_id: "u1", tipo: "video", titulo: null, url_externa: "https://v.com", orden: 1 }],
        docente_instrumento: [{ docente_id: "u1", instrumento_id: "i1", es_principal: true, instrumentos: { nombre: "Guitarra" } }],
      }),
    )

    expect(result.error).toBeNull()
    expect(result.data).toMatchObject({
      id: "u1",
      nombre: "Leo Brouwer",
      email: "leo@x.com",
      aniosExperiencia: 12,
      redesSociales: { instagram: "@leo" },
    })
    expect(result.data!.formacion[0]).toMatchObject({ id: "f1", anioInicio: 2000, anioFin: 2005 })
    expect(result.data!.portafolio[0]).toMatchObject({ titulo: "Sin título", urlExterna: "https://v.com" })
    expect(result.data!.instrumentos[0]).toMatchObject({ nombre: "Guitarra", esPrincipal: true })
  })

  it("getTeacherPerfil cae a perfiles y a 'Docente' sin fila de docente", async () => {
    const result = await getTeacherPerfil(
      clientWithTables({
        docentes: [],
        perfiles: [{ id: "u1", nombres: "Ada", apellidos: "Lovelace", email: "ada@x.com" }],
      }),
    )

    expect(result.data).toMatchObject({ nombre: "Ada Lovelace", email: "ada@x.com", formacion: [] })
  })

  it("getTeacherPerfil propaga errores", async () => {
    const result = await getTeacherPerfil(
      createFakeSupabase.withError("docentes", "boom", {}, { user: USER }),
    )

    expect(result).toEqual({ data: null, error: "boom" })
  })

  it("getTeacherCatedras mapea inscritos y horarios", async () => {
    const result = await getTeacherCatedras(
      clientWithTables({
        catedras: [
          {
            id: "c1",
            codigo: "C-01",
            curso_id: "k1",
            docente_id: "u1",
            aula: "A1",
            cupo_maximo: 10,
            modalidad: "presencial",
            estado: "en_curso",
            cursos: { nombre: "Guitarra" },
            catedra_horarios: [{ dia_semana: "lunes", hora_inicio: "15:00", hora_fin: "16:00" }],
            inscripciones: [{ estado: "activa" }, { estado: "retirada" }],
          },
        ],
        perfil_rol: [],
      }),
    )

    expect(result.data![0]).toMatchObject({
      codigo: "C-01",
      curso: "Guitarra",
      inscritos: 1,
      estado: "en_curso",
    })
    expect(result.data![0].horarios).toHaveLength(1)
  })

  it("getTeacherEstudiantes devuelve [] sin cátedras", async () => {
    const result = await getTeacherEstudiantes(clientWithTables({ catedras: [], perfil_rol: [] }))

    expect(result).toEqual({ data: [], error: null })
  })

  it("getTeacherEstudiantes combina promedios y asistencias", async () => {
    const result = await getTeacherEstudiantes(
      clientWithTables({
        perfil_rol: [],
        catedras: [{ id: "c1", docente_id: "u1" }],
        inscripciones: [
          {
            id: "i1",
            estudiante_id: "e1",
            catedra_id: "c1",
            fecha_inscripcion: "2026-01-01",
            estado: "activa",
            estudiantes: { id: "e1", nombres: "Ada", apellidos: "Lovelace", email: "a@x.com", celular: "099" },
            catedras: { codigo: "C-01", cursos: { nombre: "Guitarra" } },
          },
        ],
        v_promedio_academico: [{ inscripcion_id: "i1", catedra_id: "c1", promedio_sobre_10: 8.5, evaluaciones_rendidas: 4 }],
        asistencias: [
          { inscripcion_id: "i1", estado: "presente" },
          { inscripcion_id: "i1", estado: "atraso" },
          { inscripcion_id: "i1", estado: "ausente" },
        ],
      }),
    )

    expect(result.data![0]).toMatchObject({
      nombre: "Ada Lovelace",
      promedioSobre10: 8.5,
      evaluacionesRendidas: 4,
      porcentajeAsistencia: 67,
      asistenciasPresentes: 2,
      totalAsistenciasRegistradas: 3,
    })
  })

  it("getTeacherEvaluaciones calcula promedio y total de inscritos", async () => {
    const result = await getTeacherEvaluaciones(
      clientWithTables({
        perfil_rol: [],
        catedras: [{ id: "c1", docente_id: "u1" }],
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
            calificaciones: [{ nota: 8 }, { nota: 6 }],
          },
        ],
        inscripciones: [{ id: "i1", catedra_id: "c1", estado: "activa" }, { id: "i2", catedra_id: "c1", estado: "activa" }],
      }),
    )

    expect(result.data![0]).toMatchObject({
      catedra: "C-01",
      curso: "Guitarra",
      rendidas: 2,
      totalEstudiantes: 2,
      promedio: 7,
    })
  })

  it("getTeacherMateriales calcula destino y filtra por docente", async () => {
    const result = await getTeacherMateriales(
      clientWithTables({
        perfil_rol: [],
        catedras: [{ id: "c1", curso_id: "k1", docente_id: "u1" }],
        materiales: [
          { id: "m1", titulo: "A", tipo: "pdf", visible_para: "inscritos", curso_id: "k1", catedra_id: "c1", storage_path: null, url_externa: null, subido_por: "u1", created_at: "2026-01-01", cursos: { nombre: "Guitarra" }, catedras: { codigo: "C-01" } },
          { id: "m2", titulo: "B", tipo: "audio", visible_para: "publico", curso_id: "k1", catedra_id: null, storage_path: "s", url_externa: null, subido_por: "u1", created_at: "2026-01-02", cursos: { nombre: "Guitarra" }, catedras: null },
          { id: "m3", titulo: "C", tipo: "video", visible_para: "docentes", curso_id: null, catedra_id: null, storage_path: null, url_externa: "https://x.com", subido_por: "u1", created_at: "2026-01-03", cursos: null, catedras: null },
        ],
      }),
    )

    expect(result.data!.map((item) => item.destino)).toEqual([
      "General",
      "Curso Guitarra",
      "Cátedra C-01",
    ])
  })

  it("getTeacherCatalogos mapea cátedras e instrumentos", async () => {
    const result = await getTeacherCatalogos(
      clientWithTables({
        perfil_rol: [],
        catedras: [{ id: "c1", codigo: "C-01", docente_id: "u1", estado: "en_curso", cursos: { nombre: "Guitarra" } }],
        instrumentos: [{ id: "i1", nombre: "Guitarra", activo: true }],
      }),
    )

    expect(result.data!.catedras[0]).toEqual({ id: "c1", codigo: "C-01", cursoNombre: "Guitarra" })
    expect(result.data!.instrumentos).toEqual([{ id: "i1", nombre: "Guitarra" }])
  })

  it("getTeacherSesiones cuenta asistencias y devuelve [] sin cátedras", async () => {
    expect(await getTeacherSesiones(clientWithTables({ catedras: [], perfil_rol: [] }))).toEqual({
      data: [],
      error: null,
    })

    const result = await getTeacherSesiones(
      clientWithTables({
        perfil_rol: [],
        catedras: [{ id: "c1", docente_id: "u1" }],
        sesiones: [
          {
            id: "s1",
            fecha: "2026-06-15",
            hora_inicio: "15:00",
            hora_fin: "16:00",
            tema: "Escalas",
            estado: "programada",
            catedra_id: "c1",
            catedras: { codigo: "C-01", cursos: { nombre: "Guitarra" } },
            asistencias: [{ estado: "presente" }, { estado: "ausente" }],
          },
        ],
      }),
    )

    expect(result.data![0]).toMatchObject({ presentes: 1, totalAsistencia: 2, catedra: "C-01" })
  })

  it("getTeacherSesionAsistencia mezcla inscripciones con asistencias y ordena", async () => {
    const result = await getTeacherSesionAsistencia(
      "s1",
      clientWithTables({
        sesiones: [
          {
            id: "s1",
            catedra_id: "c1",
            fecha: "2026-06-15",
            hora_inicio: "15:00",
            hora_fin: "16:00",
            tema: null,
            catedras: { codigo: "C-01", cursos: { nombre: "Guitarra" } },
          },
        ],
        inscripciones: [
          { id: "i2", estudiante_id: "e2", catedra_id: "c1", estado: "activa", estudiantes: { id: "e2", nombres: "Zoe", apellidos: "Zapata" } },
          { id: "i1", estudiante_id: "e1", catedra_id: "c1", estado: "activa", estudiantes: { id: "e1", nombres: "Ada", apellidos: "Lovelace" } },
        ],
        asistencias: [{ sesion_id: "s1", inscripcion_id: "i1", estado: "ausente", observacion: "enferma" }],
      }),
    )

    expect(result.error).toBeNull()
    expect(result.data!.estudiantes.map((item) => item.estudianteNombre)).toEqual([
      "Ada Lovelace",
      "Zoe Zapata",
    ])
    expect(result.data!.estudiantes[0]).toMatchObject({ estado: "ausente", observacion: "enferma" })
    expect(result.data!.estudiantes[1].estado).toBe("presente")
  })

  it("getTeacherSesionAsistencia propaga error de sesión", async () => {
    const result = await getTeacherSesionAsistencia(
      "missing",
      clientWithTables({ sesiones: [] }),
    )

    expect(result.data).toBeNull()
    expect(result.error).toBeTruthy()
  })

  it("getEstudianteAsistencias mapea historial", async () => {
    const result = await getEstudianteAsistencias(
      "i1",
      clientWithTables({
        asistencias: [
          {
            inscripcion_id: "i1",
            sesion_id: "s1",
            estado: "presente",
            observacion: null,
            sesiones: { fecha: "2026-06-15", hora_inicio: "15:00", hora_fin: "16:00", tema: "Escalas" },
          },
        ],
      }),
    )

    expect(result.data![0]).toMatchObject({ sesionId: "s1", fecha: "2026-06-15", tema: "Escalas" })
  })

  it("getCursoTemario mapea módulos y lecciones ordenadas", async () => {
    const result = await getCursoTemario(
      "k1",
      clientWithTables({
        cursos: [{ id: "k1", nombre: "Guitarra" }],
        curso_modulos: [
          {
            id: "m1",
            curso_id: "k1",
            titulo: "Módulo 1",
            descripcion: null,
            orden: 0,
            curso_lecciones: [
              { id: "l2", titulo: "Dos", descripcion: null, duracion_minutos: 10, orden: 2, es_muestra: false },
              { id: "l1", titulo: "Uno", descripcion: null, duracion_minutos: 5, orden: 1, es_muestra: true },
            ],
          },
        ],
      }),
    )

    expect(result.data!.cursoNombre).toBe("Guitarra")
    expect(result.data!.modulos[0].lecciones.map((l) => l.id)).toEqual(["l1", "l2"])
  })

  it("getCursoTemario devuelve 'Curso no encontrado'", async () => {
    const result = await getCursoTemario("missing", clientWithTables({ cursos: [], curso_modulos: [] }))

    expect(result).toEqual({ data: null, error: "Curso no encontrado" })
  })
})

describe("teacher-portal mutators", () => {
  beforeEach(() => {
    createSupabaseBrowserClientMock.mockReset()
    createSupabaseBrowserClientMock.mockReturnValue(clientWithTables())
  })

  it("crea evaluación, sesión, formación, material, portafolio y reconocimiento", async () => {
    const client = configureClient(clientWithTables())
    const calls = instrument(client)

    await expect(
      createTeacherEvaluacion({
        catedraId: "c1",
        titulo: "Parcial",
        tipo: "sumativa",
        fecha: "2026-06-01",
        notaMaxima: 10,
        ponderacion: 30,
        descripcion: "",
      }),
    ).resolves.toEqual({ data: { id: expect.any(String) }, error: null })

    await createTeacherSesion({
      catedraId: "c1",
      fecha: "2026-06-15",
      horaInicio: "15:00",
      horaFin: "16:00",
      tema: "",
    })
    await createTeacherFormacion({ institucion: "X", titulo: "Y", anioInicio: 2000, anioFin: 2005, descripcion: "" })
    await createTeacherMaterial({
      catedraId: "c1",
      titulo: "PDF",
      tipo: "pdf",
      visibilidad: "inscritos",
      urlExterna: "",
      storagePath: "",
    })
    await createTeacherPortafolio({ titulo: "Video", tipo: "video", urlExterna: "https://v.com" })
    await createTeacherReconocimiento({ titulo: "Premio", anio: 2020, entidadOtorgante: "", descripcion: "" })

    expect(calls).toEqual([
      "evaluaciones",
      "sesiones",
      "docente_formacion",
      "materiales",
      "docente_portafolio",
      "docente_reconocimientos",
    ])
  })

  it("los create responden No autenticado sin usuario", async () => {
    configureClient(createFakeSupabase({}))

    await expect(
      createTeacherEvaluacion({
        catedraId: "c1",
        titulo: "Parcial",
        tipo: "sumativa",
        fecha: "2026-06-01",
        notaMaxima: 10,
        ponderacion: 30,
        descripcion: "",
      }),
    ).resolves.toEqual({ data: null, error: "No autenticado" })
  })

  it("elimina recursos de formación, material, portafolio y reconocimiento", async () => {
    const client = configureClient(clientWithTables())
    const calls = instrument(client)

    await expect(deleteTeacherFormacion("f1")).resolves.toEqual({ error: null })
    await expect(deleteTeacherMaterial("m1")).resolves.toEqual({ error: null })
    await expect(deleteTeacherPortafolio("p1")).resolves.toEqual({ error: null })
    await expect(deleteTeacherReconocimiento("r1")).resolves.toEqual({ error: null })

    expect(calls).toEqual([
      "docente_formacion",
      "materiales",
      "docente_portafolio",
      "docente_reconocimientos",
    ])
  })

  it("guardar asistencias hace upsert con observación normalizada", async () => {
    configureClient(clientWithTables())

    await expect(
      guardarTeacherAsistencias("s1", [
        { inscripcionId: "i1", estado: "presente", observacion: "  ok  " },
        { inscripcionId: "i2", estado: "ausente" },
      ]),
    ).resolves.toEqual({ error: null })
  })

  it("guardar calificaciones omite notas nulas y no escribe si todo es null", async () => {
    const client = configureClient(clientWithTables())
    const calls = instrument(client)

    await expect(
      guardarTeacherCalificaciones("ev1", [
        { inscripcionId: "i1", nota: 8, observacion: " " },
        { inscripcionId: "i2", nota: null },
      ]),
    ).resolves.toEqual({ error: null })
    expect(calls).toEqual(["calificaciones"])

    const client2 = configureClient(clientWithTables())
    const calls2 = instrument(client2)

    await expect(
      guardarTeacherCalificaciones("ev1", [{ inscripcionId: "i1", nota: null }]),
    ).resolves.toEqual({ error: null })
    expect(calls2).toEqual([])
  })

  it("updateTeacherPerfil actualiza si existe o inserta si no", async () => {
    configureClient(clientWithTables({ docentes: [{ perfil_id: "u1" }] }))
    await expect(updateTeacherPerfil({ tituloProfesional: "", biografia: "", fraseDestacada: "", aniosExperiencia: 0, instagram: "", linkedin: "", youtube: "", facebook: "" })).resolves.toEqual({ error: null })

    configureClient(clientWithTables({ docentes: [] }))
    await expect(updateTeacherPerfil({ tituloProfesional: "", biografia: "", fraseDestacada: "", aniosExperiencia: 0, instagram: "", linkedin: "", youtube: "", facebook: "" })).resolves.toEqual({ error: null })
  })

  it("updateTeacherInstrumentos borra y reinserta", async () => {
    const client = configureClient(clientWithTables({ docente_instrumento: [{ docente_id: "u1", instrumento_id: "i9", es_principal: false }] }))
    const calls = instrument(client)

    await expect(
      updateTeacherInstrumentos([{ instrumentoId: "i1", esPrincipal: true }]),
    ).resolves.toEqual({ error: null })
    expect(calls).toEqual(["docente_instrumento", "docente_instrumento"])
  })

  it("updateTeacherSesionEstado actualiza el estado", async () => {
    configureClient(clientWithTables({ sesiones: [{ id: "s1", estado: "programada" }] }))

    await expect(updateTeacherSesionEstado("s1", "realizada")).resolves.toEqual({ error: null })
  })

  it("propaga errores de escritura", async () => {
    configureClient(createFakeSupabase.withError("sesiones", "boom", {}, { user: USER }))
    await expect(updateTeacherSesionEstado("s1", "realizada")).resolves.toEqual({ error: "boom" })

    configureClient(createFakeSupabase.withError("materiales", "boom materiales", {}, { user: USER }))
    await expect(deleteTeacherMaterial("m1")).resolves.toEqual({ error: "boom materiales" })
  })
})
