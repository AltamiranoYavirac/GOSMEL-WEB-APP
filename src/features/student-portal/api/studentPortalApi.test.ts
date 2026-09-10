import { beforeEach, describe, expect, it, vi } from "vitest"

const { createSupabaseBrowserClientMock } = vi.hoisted(() => ({
  createSupabaseBrowserClientMock: vi.fn(),
}))

vi.mock("@/shared/api/supabase/client", () => ({
  createSupabaseBrowserClient: createSupabaseBrowserClientMock,
}))

import { createFakeSupabase } from "@/test/supabase"
import type { TFakeSupabaseClient, TFakeTables } from "@/test/supabase.types"

import { createCourseReview } from "./createCourseReview"
import { createPracticeLog } from "./createPracticeLog"
import { getCatedrasDisponibles } from "./getCatedrasDisponibles"
import { getStudentAttendance } from "./getStudentAttendance"
import { getStudentCatedras } from "./getStudentCatedras"
import { getStudentCertificates } from "./getStudentCertificates"
import { getStudentContext } from "./getStudentContext"
import { getStudentCurriculum } from "./getStudentCurriculum"
import { getStudentFavorites } from "./getStudentFavorites"
import { getStudentGrades } from "./getStudentGrades"
import { getStudentPracticeLogs } from "./getStudentPracticeLogs"
import { getStudentReviews } from "./getStudentReviews"
import { getStudentSessions } from "./getStudentSessions"
import { reportStudentPayment } from "./reportStudentPayment"
import { solicitarMatricula } from "./solicitarMatricula"
import { toggleFavorite } from "./toggleFavorite"

const USER = { id: "u1", email: "ada@x.com" }

function client(tables: TFakeTables = {}, user: typeof USER | null = USER): TFakeSupabaseClient {
  return createFakeSupabase(tables, { user: user ?? undefined, claims: user ? { sub: user.id, user_roles: ["estudiante"] } : null })
}

describe("student-portal getters", () => {
  beforeEach(() => {
    createSupabaseBrowserClientMock.mockReset()
  })

  it("getStudentContext arma estudiantes, instrumentos y roles", async () => {
    const result = await getStudentContext(
      client({
        perfiles: [{ id: "u1", nombres: "Grace" }],
        v_estudiantes: [
          { id: "e1", nombres: "Ada", apellidos: "Lovelace", avatar_public_id: "a/1", nivel_musical: "intermedio", es_menor: false, tiene_cuenta: true },
          { id: null, nombres: "Sin", apellidos: "Id", avatar_public_id: null, nivel_musical: null, es_menor: true, tiene_cuenta: false },
        ],
        estudiante_instrumento: [
          { estudiante_id: "e1", instrumentos: { nombre: "Guitarra" } },
          { estudiante_id: "e1", instrumentos: { nombre: "Piano" } },
        ],
      }),
    )

    expect(result.error).toBeNull()
    expect(result.data!.nombreUsuario).toBe("Grace")
    expect(result.data!.roles).toEqual(["estudiante"])
    expect(result.data!.estudiantes).toHaveLength(1)
    expect(result.data!.estudiantes[0]).toMatchObject({
      id: "e1",
      nombre: "Ada Lovelace",
      instrumentos: ["Guitarra", "Piano"],
      tieneCuenta: true,
    })
  })

  it("getStudentContext responde No autenticado", async () => {
    const result = await getStudentContext(client({}, null))

    expect(result).toEqual({ data: null, error: "No autenticado" })
  })

  it("getStudentCurriculum marca lecciones completadas por inscripción", async () => {
    const result = await getStudentCurriculum(
      "e1",
      client({
        inscripciones: [
          {
            id: "i1",
            estudiante_id: "e1",
            estado: "activa",
            progreso_pct: 50,
            catedra_id: "c1",
            catedras: { codigo: "C-01", cursos: { id: "k1", nombre: "Guitarra" } },
          },
        ],
        curso_modulos: [
          {
            id: "m1",
            curso_id: "k1",
            titulo: "Módulo 1",
            descripcion: null,
            orden: 0,
            curso_lecciones: [
              { id: "l1", titulo: "Uno", duracion_minutos: 10, orden: 1 },
              { id: "l2", titulo: "Dos", duracion_minutos: 20, orden: 2 },
            ],
          },
        ],
        progreso_lecciones: [{ inscripcion_id: "i1", leccion_id: "l1", completada: true }],
      }),
    )

    expect(result.data![0]).toMatchObject({ cursoId: "k1", curso: "Guitarra", catedra: "C-01", progresoPct: 50 })
    expect(result.data![0].modulos[0].lecciones).toEqual([
      { id: "l1", titulo: "Uno", duracionMinutos: 10, completada: true },
      { id: "l2", titulo: "Dos", duracionMinutos: 20, completada: false },
    ])
  })

  it("getStudentCurriculum devuelve [] sin inscripciones", async () => {
    expect(await getStudentCurriculum("e1", client({ inscripciones: [] }))).toEqual({ data: [], error: null })
  })

  it("getStudentGrades filtra evaluaciones sin nota y calcula campos", async () => {
    const result = await getStudentGrades(
      "e1",
      client({
        inscripciones: [{ id: "i1", estudiante_id: "e1", estado: "activa", catedra_id: "c1" }],
        evaluaciones: [
          {
            id: "ev1",
            titulo: "Parcial",
            tipo: "sumativa",
            fecha: "2026-06-01",
            nota_maxima: 10,
            ponderacion: 30,
            catedra_id: "c1",
            catedras: { codigo: "C-01", cursos: { nombre: "Guitarra" } },
            calificaciones: [{ nota: 8.5, observacion: "bien", inscripcion_id: "i1" }],
          },
          {
            id: "ev2",
            titulo: "Sin rendir",
            tipo: "formativa",
            fecha: "2026-06-02",
            nota_maxima: null,
            ponderacion: null,
            catedra_id: "c1",
            catedras: null,
            calificaciones: [],
          },
        ],
      }),
    )

    expect(result.data).toHaveLength(1)
    expect(result.data![0]).toEqual({
      id: "ev1-i1",
      titulo: "Parcial",
      tipo: "sumativa",
      fecha: "2026-06-01",
      notaMaxima: 10,
      ponderacion: 30,
      nota: 8.5,
      observacion: "bien",
      catedra: "C-01",
      curso: "Guitarra",
    })
  })

  it("getStudentGrades devuelve [] sin cátedras", async () => {
    expect(await getStudentGrades("e1", client({ inscripciones: [] }))).toEqual({ data: [], error: null })
  })

  it("getStudentAttendance agrega estados y porcentaje", async () => {
    const result = await getStudentAttendance(
      "e1",
      client({
        inscripciones: [{ id: "i1", estudiante_id: "e1", estado: "activa" }],
        asistencias: [
          { inscripcion_id: "i1", estado: "presente", observacion: null, sesion_id: "s1", sesiones: { fecha: "2026-06-01", catedras: { codigo: "C-01" } } },
          { inscripcion_id: "i1", estado: "atraso", observacion: null, sesion_id: "s2", sesiones: { fecha: "2026-06-02", catedras: { codigo: "C-01" } } },
          { inscripcion_id: "i1", estado: "ausente", observacion: "x", sesion_id: "s3", sesiones: null },
          { inscripcion_id: "i1", estado: "justificado", observacion: null, sesion_id: "s4", sesiones: { fecha: "2026-06-04", catedras: null } },
        ],
      }),
    )

    expect(result.data).toMatchObject({
      presentes: 1,
      atrasos: 1,
      ausentes: 1,
      justificados: 1,
      total: 4,
      porcentajeAsistencia: 50,
    })
    expect(result.data!.items[2].catedra).toBe("—")
  })

  it("getStudentAttendance devuelve ceros sin inscripciones", async () => {
    const result = await getStudentAttendance("e1", client({ inscripciones: [] }))

    expect(result.data).toEqual({ items: [], presentes: 0, atrasos: 0, ausentes: 0, justificados: 0, total: 0, porcentajeAsistencia: 0 })
  })

  it("getStudentSessions separa próximas y pasadas", async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 5, 15, 12))

    try {
      const result = await getStudentSessions(
        "e1",
        client({
          inscripciones: [{ estudiante_id: "e1", catedra_id: "c1", estado: "activa" }],
          sesiones: [
            { id: "s3", catedra_id: "c1", fecha: "2026-06-10", hora_inicio: "15:00", hora_fin: "16:00", tema: null, estado: "programada", catedras: { codigo: "C-01", cursos: { nombre: "Guitarra" } } },
            { id: "s2", catedra_id: "c1", fecha: "2026-06-15", hora_inicio: "15:00", hora_fin: "16:00", tema: null, estado: "reprogramada", catedras: { codigo: "C-01", cursos: { nombre: "Guitarra" } } },
            { id: "s1", catedra_id: "c1", fecha: "2026-06-16", hora_inicio: "15:00", hora_fin: "16:00", tema: null, estado: "programada", catedras: { codigo: "C-01", cursos: { nombre: "Guitarra" } } },
            { id: "s4", catedra_id: "c1", fecha: "2026-06-17", hora_inicio: "15:00", hora_fin: "16:00", tema: null, estado: "cancelada", catedras: { codigo: "C-01", cursos: { nombre: "Guitarra" } } },
          ],
        }),
      )

      expect(result.data!.proximas.map((s) => s.id)).toEqual(["s2", "s1"])
      expect(result.data!.pasadas.map((s) => s.id)).toEqual(["s4", "s3"])
    } finally {
      vi.useRealTimers()
    }
  })

  it("getStudentCatedras mapea docente, horarios y progreso", async () => {
    const result = await getStudentCatedras(
      "e1",
      client({
        inscripciones: [
          {
            id: "i1",
            estudiante_id: "e1",
            estado: "activa",
            progreso_pct: 30,
            catedra_id: "c1",
            catedras: {
              codigo: "C-01",
              aula: "A1",
              modalidad: "presencial",
              cursos: { id: "k1", nombre: "Guitarra", nivel: "intermedio" },
              catedra_horarios: [{ dia_semana: "lunes", hora_inicio: "15:00", hora_fin: "16:00" }],
              docentes: { perfiles: { nombres: "Leo", apellidos: "Brouwer" } },
            },
          },
        ],
      }),
    )

    expect(result.data![0]).toMatchObject({
      inscripcionId: "i1",
      curso: "Guitarra",
      docente: "Leo Brouwer",
      progresoPct: 30,
    })
    expect(result.data![0].horarios).toEqual([{ dia: "lunes", inicio: "15:00", fin: "16:00" }])
  })

  it("getStudentCertificates mapea certificados filtrados por estudiante", async () => {
    const result = await getStudentCertificates(
      "e1",
      client({
        certificados: [
          {
            id: "cert1",
            codigo_verificacion: "ABC",
            fecha_emision: "2026-06-01",
            storage_path: "certs/1.pdf",
            inscripciones: {
              estudiante_id: "e1",
              estudiantes: { id: "e1" },
              catedras: { codigo: "C-01", cursos: { nombre: "Guitarra" } },
            },
          },
        ],
      }),
    )

    expect(result.data![0]).toEqual({
      id: "cert1",
      codigoVerificacion: "ABC",
      fechaEmision: "2026-06-01",
      storagePath: "certs/1.pdf",
      curso: "Guitarra",
      catedra: "C-01",
    })
  })

  it("getStudentFavorites mapea favoritos", async () => {
    const result = await getStudentFavorites(
      client({
        favoritos: [
          { perfil_id: "u1", curso_id: "k1", created_at: "2026-01-01", cursos: { nombre: "Guitarra", nivel: "basico", portada_public_id: "p/1" } },
          { perfil_id: "u1", curso_id: "k2", created_at: "2026-01-02", cursos: null },
        ],
      }),
    )

    expect(result.data).toEqual([
      { cursoId: "k2", nombre: "Curso", nivel: null, portadaPublicId: null },
      { cursoId: "k1", nombre: "Guitarra", nivel: "basico", portadaPublicId: "p/1" },
    ])
  })

  it("getStudentFavorites responde No autenticado", async () => {
    expect(await getStudentFavorites(client({}, null))).toEqual({ data: null, error: "No autenticado" })
  })

  it("getStudentPracticeLogs calcula racha y semana", async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 5, 15, 12))

    try {
      const result = await getStudentPracticeLogs(
        "e1",
        client({
          registros_practica: [
            { id: "p1", estudiante_id: "e1", fecha: "2026-06-15", minutos: 30, nota: null, inscripcion_id: "i1", inscripciones: { catedras: { codigo: "C-01" } } },
            { id: "p2", estudiante_id: "e1", fecha: "2026-06-14", minutos: 20, nota: "ok", inscripcion_id: "i1", inscripciones: null },
            { id: "p3", estudiante_id: "e1", fecha: "2026-06-10", minutos: 50, nota: null, inscripcion_id: "i1", inscripciones: { catedras: { codigo: "C-01" } } },
          ],
        }),
      )

      expect(result.data!.logs).toHaveLength(3)
      expect(result.data!.logs[0].catedra).toBe("C-01")
      expect(result.data!.logs[1].catedra).toBeNull()
      expect(result.data!.rachaDias).toBe(2)
      expect(result.data!.semana).toHaveLength(7)
      expect(result.data!.semana.at(-1)).toEqual({ dia: "2026-06-15", minutos: 30 })
      expect(result.data!.semana.at(-6)).toEqual({ dia: "2026-06-10", minutos: 50 })
    } finally {
      vi.useRealTimers()
    }
  })

  it("getStudentReviews mapea reseñas", async () => {
    const result = await getStudentReviews(
      "e1",
      client({
        curso_resenas: [
          { id: "r1", estudiante_id: "e1", curso_id: "k1", puntuacion: 5, comentario: "Excelente", publicado: true, created_at: "2026-01-01", cursos: { nombre: "Guitarra" } },
        ],
      }),
    )

    expect(result.data![0]).toEqual({
      id: "r1",
      cursoId: "k1",
      curso: "Guitarra",
      puntuacion: 5,
      comentario: "Excelente",
      publicado: true,
      creadaEn: "2026-01-01",
    })
  })

  it("getCatedrasDisponibles excluye las inscritas", async () => {
    const result = await getCatedrasDisponibles(
      "e1",
      client({
        catedras: [
          { id: "c1", codigo: "C-01", aula: "A1", modalidad: "presencial", estado: "en_curso", cursos: { id: "k1", nombre: "Guitarra", nivel: "basico", precio_referencial: "45" } },
          { id: "c2", codigo: "C-02", aula: null, modalidad: "virtual", estado: "planificada", cursos: null },
        ],
        inscripciones: [{ estudiante_id: "e1", catedra_id: "c1", estado: "activa" }],
      }),
    )

    expect(result.data).toHaveLength(1)
    expect(result.data![0]).toMatchObject({ id: "c2", curso: "Curso", precioReferencial: null })
  })

  it("getCatedrasDisponibles funciona sin estudiante", async () => {
    const result = await getCatedrasDisponibles(
      null,
      client({
        catedras: [{ id: "c1", codigo: "C-01", aula: "A1", modalidad: "presencial", estado: "en_curso", cursos: { id: "k1", nombre: "Guitarra", nivel: "basico", precio_referencial: 45 } }],
      }),
    )

    expect(result.data).toHaveLength(1)
    expect(result.data![0].precioReferencial).toBe(45)
  })
})

describe("student-portal mutators", () => {
  beforeEach(() => {
    createSupabaseBrowserClientMock.mockReset()
  })

  it("reportStudentPayment inserta pago pendiente de verificación", async () => {
    createSupabaseBrowserClientMock.mockReturnValue(client())

    const result = await reportStudentPayment({
      cuotaId: "q1",
      values: { monto: 50, metodo: "transferencia", referencia: " REF ", comprobanteStoragePath: " c.pdf ", observacion: "" },
    })

    expect(result.error).toBeNull()
    expect(result.data).toEqual({ id: expect.any(String) })
  })

  it("solicitarMatricula normaliza args y mapea duplicado", async () => {
    const rpc = vi.fn(() => "insc-1")
    createSupabaseBrowserClientMock.mockReturnValue(
      createFakeSupabase({}, { rpcResults: { solicitar_matricula: rpc } }),
    )

    const result = await solicitarMatricula({ catedraId: "c1", paraMenor: false, nombres: " Ada " })
    expect(result).toEqual({ data: { inscripcionId: "insc-1" }, error: null })
    expect(rpc).toHaveBeenCalledWith({
      p_catedra_id: "c1",
      p_para_menor: false,
      p_nombres: "Ada",
      p_apellidos: null,
      p_fecha_nacimiento: null,
      p_parentesco: null,
    })

    createSupabaseBrowserClientMock.mockReturnValue(
      createFakeSupabase({}, { rpcError: "duplicate key value violates unique constraint", rpcErrorCode: "23505" }),
    )
    const duplicate = await solicitarMatricula({ catedraId: "c1", paraMenor: false })
    expect(duplicate).toEqual({
      data: null,
      error: "Ya estás matriculado o tienes una solicitud pendiente en esta cátedra",
    })
  })

  it("toggleFavorite quita si existe y agrega si no", async () => {
    createSupabaseBrowserClientMock.mockReturnValue(
      createFakeSupabase({ favoritos: [{ perfil_id: "u1", curso_id: "k1" }] }, { user: USER }),
    )
    await expect(toggleFavorite("k1")).resolves.toEqual({ data: { favorito: false }, error: null })

    createSupabaseBrowserClientMock.mockReturnValue(createFakeSupabase({ favoritos: [] }, { user: USER }))
    await expect(toggleFavorite("k2")).resolves.toEqual({ data: { favorito: true }, error: null })
  })

  it("toggleFavorite responde No autenticado", async () => {
    createSupabaseBrowserClientMock.mockReturnValue(createFakeSupabase({}))

    await expect(toggleFavorite("k1")).resolves.toEqual({ data: null, error: "No autenticado" })
  })

  it("createCourseReview inserta y traduce duplicado", async () => {
    createSupabaseBrowserClientMock.mockReturnValue(client())
    await expect(
      createCourseReview("e1", { cursoId: "k1", puntuacion: 5, comentario: " Excelente " }),
    ).resolves.toEqual({ data: { id: expect.any(String) }, error: null })

    createSupabaseBrowserClientMock.mockReturnValue(
      createFakeSupabase.withError("curso_resenas", "duplicate key", {}, { errorCodes: { curso_resenas: "23505" } }),
    )
    await expect(
      createCourseReview("e1", { cursoId: "k1", puntuacion: 5, comentario: "" }),
    ).resolves.toEqual({ data: null, error: "Ya valoraste este curso" })
  })

  it("createPracticeLog inserta minutos y fecha", async () => {
    createSupabaseBrowserClientMock.mockReturnValue(client())

    await expect(
      createPracticeLog("e1", { inscripcionId: "i1", fecha: "2026-06-15", minutos: 30, nota: " ok " }),
    ).resolves.toEqual({ data: { id: expect.any(String) }, error: null })
  })
})
