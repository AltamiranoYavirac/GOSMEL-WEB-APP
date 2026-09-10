import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { createFakeSupabase } from "@/test/supabase"

import { getTeacherDashboard } from "./getTeacherDashboard"

const USER = { id: "u1", email: "docente@x.com" }
const TODAY = "2026-06-15"

function buildTables() {
  return {
    perfiles: [{ id: "u1", nombres: "Leo", apellidos: "Brouwer" }],
    perfil_rol: [{ perfil_id: "u1", rol: "docente" }],
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
        inscripciones: [{ estado: "activa" }, { estado: "pendiente" }, { estado: "retirada" }],
      },
      {
        id: "c2",
        codigo: "C-02",
        curso_id: "k2",
        docente_id: "u2",
        aula: "A2",
        cupo_maximo: 8,
        modalidad: "virtual",
        estado: "finalizada",
        cursos: null,
        catedra_horarios: [],
        inscripciones: [],
      },
    ],
    sesiones: [
      {
        id: "s1",
        catedra_id: "c1",
        fecha: TODAY,
        hora_inicio: "15:00",
        hora_fin: "16:00",
        tema: "Escalas",
        estado: "programada",
        catedras: { codigo: "C-01", cursos: { nombre: "Guitarra" } },
        asistencias: [{ estado: "presente" }, { estado: "ausente" }],
      },
      {
        id: "s2",
        catedra_id: "c1",
        fecha: "2026-06-20",
        hora_inicio: "15:00",
        hora_fin: "16:00",
        tema: "Arpegios",
        estado: "programada",
        catedras: { codigo: "C-01", cursos: { nombre: "Guitarra" } },
        asistencias: [],
      },
      {
        id: "s3",
        catedra_id: "c1",
        fecha: "2026-06-10",
        hora_inicio: "15:00",
        hora_fin: "16:00",
        tema: "Repaso",
        estado: "programada",
        catedras: { codigo: "C-01", cursos: { nombre: "Guitarra" } },
        asistencias: [],
      },
      {
        id: "s4",
        catedra_id: "c1",
        fecha: "2026-06-09",
        hora_inicio: "15:00",
        hora_fin: "16:00",
        tema: "Cancelada",
        estado: "cancelada",
        catedras: { codigo: "C-01", cursos: { nombre: "Guitarra" } },
        asistencias: [],
      },
    ],
    inscripciones: [
      {
        id: "i1",
        estudiante_id: "e1",
        catedra_id: "c1",
        fecha_inscripcion: "2026-02-01",
        estado: "activa",
        estudiantes: { id: "e1", nombres: "Ada", apellidos: "Lovelace", email: "ada@x.com", celular: "099" },
        catedras: { codigo: "C-01", cursos: { nombre: "Guitarra" } },
      },
      {
        id: "i2",
        estudiante_id: "e2",
        catedra_id: "c1",
        fecha_inscripcion: "2026-02-02",
        estado: "pendiente",
        estudiantes: { id: "e2", nombres: "Alan", apellidos: "Turing", email: "alan@x.com", celular: null },
        catedras: { codigo: "C-01", cursos: { nombre: "Guitarra" } },
      },
    ],
    evaluaciones: [
      {
        id: "ev1",
        titulo: "Parcial 1",
        tipo: "parcial",
        fecha: "2026-06-01",
        ponderacion: 30,
        nota_maxima: 10,
        catedra_id: "c1",
        catedras: { codigo: "C-01", cursos: { nombre: "Guitarra" } },
        calificaciones: [{ nota: 8 }, { nota: 6 }, { nota: null }],
      },
      {
        id: "ev2",
        titulo: "Examen final",
        tipo: "examen",
        fecha: "2026-07-01",
        ponderacion: 50,
        nota_maxima: 10,
        catedra_id: "c1",
        catedras: { codigo: "C-01", cursos: { nombre: "Guitarra" } },
        calificaciones: [{ nota: 9 }],
      },
    ],
  }
}

describe("getTeacherDashboard", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(`${TODAY}T12:00:00Z`))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("devuelve 'No autenticado' sin usuario", async () => {
    const result = await getTeacherDashboard(createFakeSupabase({}))

    expect(result).toEqual({ data: null, error: "No autenticado" })
  })

  it("devuelve estructura vacía si el docente no tiene cátedras", async () => {
    const result = await getTeacherDashboard(
      createFakeSupabase({
        perfiles: [{ id: "u1", nombres: "Leo", apellidos: "Brouwer" }],
        perfil_rol: [],
        catedras: [],
      }, { user: USER }),
    )

    expect(result.error).toBeNull()
    expect(result.data).toMatchObject({
      nombre: "Leo Brouwer",
      counts: { catedrasActivas: 0, sesionesHoy: 0, inscritos: 0, evaluacionesPendientes: 0 },
      catedras: [],
    })
  })

  it("filtra cátedras por docente y agrega counts, sesiones y evaluaciones", async () => {
    const result = await getTeacherDashboard(createFakeSupabase(buildTables(), { user: USER }))

    expect(result.error).toBeNull()

    const data = result.data!
    expect(data.catedras).toHaveLength(1)
    expect(data.catedras[0]).toMatchObject({
      id: "c1",
      curso: "Guitarra",
      inscritos: 1,
      estado: "en_curso",
      horarios: [{ dia: "lunes", inicio: "15:00", fin: "16:00" }],
    })

    expect(data.counts).toEqual({
      catedrasActivas: 1,
      sesionesHoy: 1,
      inscritos: 2,
      evaluacionesPendientes: 1,
    })

    expect(data.sesionesHoy.map((sesion) => sesion.id)).toEqual(["s1"])
    expect(data.proximasSesiones.map((sesion) => sesion.id)).toEqual(["s1", "s2"])
    expect(data.pendientesAsistencia.map((sesion) => sesion.id)).toEqual(["s3"])
    expect(data.pendientesCalificar.map((evaluacion) => evaluacion.id)).toEqual(["ev2"])

    expect(data.estudiantes[0]).toMatchObject({
      inscripcionId: "i1",
      nombre: "Ada Lovelace",
      catedraCodigo: "C-01",
    })

    const evaluacion = data.pendientesCalificar[0]
    expect(evaluacion).toMatchObject({
      id: "ev2",
      rendidas: 1,
      totalEstudiantes: 2,
      notaMaxima: 10,
      ponderacion: 50,
    })
  })

  it("un admin ve todas las cátedras sin filtro de docente", async () => {
    const tables = buildTables()
    tables.perfil_rol = [{ perfil_id: "u1", rol: "admin" }]

    const result = await getTeacherDashboard(createFakeSupabase(tables, { user: USER }))

    expect(result.data!.catedras).toHaveLength(2)
  })

  it("propaga errores de perfil, cátedras y sesiones", async () => {
    await expect(
      getTeacherDashboard(createFakeSupabase.withError("perfiles", "boom perfil", buildTables(), { user: USER })),
    ).resolves.toEqual({ data: null, error: "boom perfil" })

    await expect(
      getTeacherDashboard(createFakeSupabase.withError("catedras", "boom catedras", buildTables(), { user: USER })),
    ).resolves.toEqual({ data: null, error: "boom catedras" })

    await expect(
      getTeacherDashboard(createFakeSupabase.withError("sesiones", "boom sesiones", buildTables(), { user: USER })),
    ).resolves.toEqual({ data: null, error: "boom sesiones" })
  })
})
