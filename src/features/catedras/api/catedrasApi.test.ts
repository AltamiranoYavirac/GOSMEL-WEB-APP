import { beforeEach, describe, expect, it, vi } from "vitest"

const { createSupabaseBrowserClientMock } = vi.hoisted(() => ({
  createSupabaseBrowserClientMock: vi.fn(),
}))

vi.mock("@/shared/api/supabase/client", () => ({
  createSupabaseBrowserClient: createSupabaseBrowserClientMock,
}))

import { createFakeSupabase } from "@/test/supabase"
import type { TFakeSupabaseClient } from "@/test/supabase.types"

import { crearCatedra } from "./crearCatedra"
import { agregarHorarioCatedra, eliminarHorarioCatedra, getCatedraHorarios } from "./catedraHorarios"
import { eliminarCatedra } from "./eliminarCatedra"
import { eliminarInscripcionCatedra } from "./eliminarInscripcionCatedra"
import { getCatedraEstudiantes } from "./getCatedraEstudiantes"
import { filtrarDocentesPorCurso, getCatedraOptions, sugerirCodigoCatedra } from "./getCatedraOptions"
import { updateCatedra } from "./updateCatedra"

function configure(tables: Record<string, Record<string, unknown>[]> = {}): TFakeSupabaseClient {
  const fake = createFakeSupabase(tables)
  createSupabaseBrowserClientMock.mockReturnValue(fake)
  return fake
}

function track(fake: TFakeSupabaseClient): string[] {
  const calls: string[] = []
  const original = fake.from.bind(fake) as (table: string) => unknown
  fake.from = ((table: string) => {
    calls.push(table)
    return original(table)
  }) as unknown as typeof fake.from
  return calls
}

const CATEDRA_VALUES = {
  codigo: " C-01 ",
  cursoId: "k1",
  docenteId: "p1",
  modalidad: "presencial" as const,
  aula: " A1 ",
  cupoMaximo: 10,
  fechaInicio: "2026-06-01",
  fechaFin: "",
  estado: "planificada" as const,
  diaSemana: "1" as const,
  horaInicio: "15:00",
  horaFin: "16:00",
}

describe("catedras API", () => {
  beforeEach(() => {
    createSupabaseBrowserClientMock.mockReset()
  })

  it("crearCatedra usa la operación transaccional", async () => {
    const fake = createFakeSupabase({}, { rpcResults: { crear_catedra_con_horario: "cat1" } })
    createSupabaseBrowserClientMock.mockReturnValue(fake)

    await expect(crearCatedra(CATEDRA_VALUES)).resolves.toEqual({ data: { id: "cat1" }, error: null })
  })

  it("crearCatedra admite una cátedra sin horario", async () => {
    const fake = createFakeSupabase({}, { rpcResults: { crear_catedra_con_horario: "cat2" } })
    createSupabaseBrowserClientMock.mockReturnValue(fake)

    await expect(
      crearCatedra({ ...CATEDRA_VALUES, diaSemana: "", horaInicio: "", horaFin: "" }),
    ).resolves.toEqual({ data: { id: "cat2" }, error: null })
  })

  it("getCatedraOptions marca admins, lista cursos y sugiere el siguiente código", async () => {
    const fake = configure({
      perfil_rol: [
        { perfil_id: "p1", rol: "docente" },
        { perfil_id: "p2", rol: "admin" },
      ],
      perfiles: [
        { id: "p1", nombres: "Leo", apellidos: "Brouwer" },
        { id: "p2", nombres: "Ada", apellidos: "Admin" },
      ],
      cursos: [{ id: "k1", nombre: "Guitarra", instrumento_id: "i1" }],
      catedras: [{ codigo: `CAT-${new Date().getFullYear()}-03` }],
      docente_instrumento: [{ docente_id: "p1", instrumento_id: "i1" }],
    })

    const result = await getCatedraOptions(fake)

    expect(result.data!.cursos).toEqual([{ id: "k1", nombre: "Guitarra", instrumentoId: "i1" }])
    expect(result.data!.docentes.map((d) => d.nombre)).toEqual(["Ada Admin (Admin)", "Leo Brouwer"])
    expect(result.data!.docentes.find((d) => d.id === "p1")!.instrumentoIds).toEqual(["i1"])
    expect(result.data!.sugerenciaCodigo).toBe(`CAT-${new Date().getFullYear()}-04`)
  })

  it("sugerirCodigoCatedra ignora otros años y reinicia el correlativo", () => {
    const fecha = new Date("2026-03-01")

    expect(sugerirCodigoCatedra([], fecha)).toBe("CAT-2026-01")
    expect(sugerirCodigoCatedra(["CAT-2025-09", "CAT-2026-02", "CAT-2026-10"], fecha)).toBe("CAT-2026-11")
    expect(sugerirCodigoCatedra(["OTRO-1"], fecha)).toBe("CAT-2026-01")
  })

  it("crearCatedra traduce la colisión de código único", async () => {
    createSupabaseBrowserClientMock.mockReturnValue(
      createFakeSupabase({}, { rpcError: 'duplicate key value violates unique constraint "catedras_codigo_key"' }),
    )

    await expect(crearCatedra(CATEDRA_VALUES)).resolves.toEqual({
      data: null,
      error: "Ya existe una cátedra con ese código.",
    })
  })

  it("gestiona los horarios de la cátedra", async () => {
    const tables = {
      catedra_horarios: [
        { id: "h1", catedra_id: "c1", dia_semana: 3, hora_inicio: "18:00:00", hora_fin: "19:00:00" },
        { id: "h2", catedra_id: "c1", dia_semana: 1, hora_inicio: "15:00:00", hora_fin: "16:00:00" },
        { id: "h3", catedra_id: "c2", dia_semana: 2, hora_inicio: "10:00:00", hora_fin: "11:00:00" },
      ],
    }
    configure(tables)

    const result = await getCatedraHorarios("c1", createFakeSupabase(tables))
    expect(result.data).toEqual([
      { id: "h2", diaSemana: 1, horaInicio: "15:00", horaFin: "16:00" },
      { id: "h1", diaSemana: 3, horaInicio: "18:00", horaFin: "19:00" },
    ])

    const added = await agregarHorarioCatedra({ catedraId: "c1", diaSemana: 5, horaInicio: "09:00", horaFin: "10:30" })
    expect(added.error).toBeNull()
    expect(tables.catedra_horarios.at(-1)).toMatchObject({ catedra_id: "c1", dia_semana: 5, hora_inicio: "09:00:00", hora_fin: "10:30:00" })

    await expect(eliminarHorarioCatedra("h1")).resolves.toEqual({ error: null })
  })

  it("getCatedraEstudiantes separa matriculados y pendientes", async () => {
    const result = await getCatedraEstudiantes(
      "c1",
      createFakeSupabase({
        catedras: [{ id: "c1", codigo: "C-01", cursos: { nombre: "Guitarra", precio_referencial: "45" } }],
        inscripciones: [
          {
            id: "i1",
            catedra_id: "c1",
            estado: "activa",
            fecha_inscripcion: "2026-01-01",
            estudiante_id: "e1",
            solicitada_por: null,
            estudiantes: { id: "e1", nombres: "Ada", apellidos: "Lovelace", cedula: "123", email: "a@x.com", celular: null },
            acuerdos_pago: [
              { id: "a1", monto_mensual: 45, dia_cobro: 5, estado: "vigente" },
              { id: "a0", monto_mensual: 10, dia_cobro: 5, estado: "cancelado" },
            ],
          },
          {
            id: "i2",
            catedra_id: "c1",
            estado: "pendiente",
            fecha_inscripcion: "2026-01-02",
            estudiante_id: "e2",
            solicitada_por: "r1",
            estudiantes: null,
            acuerdos_pago: [],
          },
        ],
      }),
    )

    expect(result.data).toMatchObject({ codigo: "C-01", curso: "Guitarra", precioReferencial: 45 })
    expect(result.data!.matriculados).toHaveLength(1)
    expect(result.data!.matriculados[0]).toMatchObject({ estudianteNombre: "Ada Lovelace", montoMensual: 45, diaCobro: 5 })
    expect(result.data!.pendientes[0]).toMatchObject({ estudianteNombre: "Estudiante", solicitadaPor: "r1" })
  })

  it("eliminarInscripcionCatedra limpia acuerdos y cuotas", async () => {
    configure({
      acuerdos_pago: [{ id: "a1", inscripcion_id: "i1" }],
      cuotas: [],
      inscripciones: [{ id: "i1" }],
    })

    await expect(eliminarInscripcionCatedra("i1")).resolves.toEqual({ error: null })
  })

  it("filtrarDocentesPorCurso filtra por instrumento del curso", () => {
    const docentes = [
      { id: "p1", nombre: "Leo", instrumentoIds: ["i1"] },
      { id: "p2", nombre: "Ada", instrumentoIds: [] },
    ]
    const cursos = [{ id: "k1", nombre: "Guitarra", instrumentoId: "i1" }]

    expect(filtrarDocentesPorCurso(docentes, cursos, "k1").map((d) => d.id)).toEqual(["p1"])
    expect(filtrarDocentesPorCurso(docentes, cursos, "k1", true).map((d) => d.id)).toEqual(["p1", "p2"])
    expect(
      filtrarDocentesPorCurso(docentes, cursos, "k1", false, "p2").map((d) => d.id),
    ).toEqual(["p1", "p2"])
    expect(
      filtrarDocentesPorCurso(docentes, [{ id: "k2", nombre: "Otro", instrumentoId: null }], "k2"),
    ).toEqual(docentes)
    expect(filtrarDocentesPorCurso([{ id: "p2", nombre: "Ada", instrumentoIds: [] }], cursos, "k1")).toEqual([
      { id: "p2", nombre: "Ada", instrumentoIds: [] },
    ])
  })

  it("updateCatedra asegura docente y actualiza", async () => {
    const rpc = vi.fn(() => "p1")
    const fake = createFakeSupabase(
      { catedras: [{ id: "c1" }] },
      { rpcResults: { registrar_docente: rpc } },
    )
    createSupabaseBrowserClientMock.mockReturnValue(fake)
    const calls = track(fake)

    await expect(
      updateCatedra({
        id: "c1",
        codigo: "C-01",
        curso_id: "k1",
        docente_id: "p1",
        cupo_maximo: 12,
        aula: " A2 ",
        modalidad: "virtual",
        estado: "en_curso",
        fecha_inicio: "2026-06-01",
        fecha_fin: null,
      }),
    ).resolves.toEqual({ error: null })

    expect(rpc).toHaveBeenCalledWith({ p_perfil_id: "p1" })
    expect(calls).toEqual(["catedras"])
  })

  it("eliminarCatedra bloquea con matrículas activas y borra si no", async () => {
    configure({ inscripciones: [{ id: "i1", catedra_id: "c1", estado: "activa" }] })

    const blocked = await eliminarCatedra("c1")
    expect(blocked.error).toContain("1 estudiante(s) matriculado(s)")

    configure({ inscripciones: [{ id: "i2", catedra_id: "c1", estado: "finalizada" }], catedras: [{ id: "c1" }] })
    await expect(eliminarCatedra("c1")).resolves.toEqual({ error: null })
  })

  it("propaga errores de listado", async () => {
    createSupabaseBrowserClientMock.mockReturnValue(createFakeSupabase.withError("inscripciones", "boom"))

    await expect(eliminarCatedra("c1")).resolves.toEqual({ error: "boom" })
  })
})
