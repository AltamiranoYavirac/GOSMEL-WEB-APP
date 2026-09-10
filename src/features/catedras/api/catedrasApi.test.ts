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
import { eliminarCatedra } from "./eliminarCatedra"
import { eliminarInscripcionCatedra } from "./eliminarInscripcionCatedra"
import { generarSesionesCatedra } from "./generarSesionesCatedra"
import { getCatedraEstudiantes } from "./getCatedraEstudiantes"
import { getCatedraOptions } from "./getCatedraOptions"
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
  diaSemana: "1",
  horaInicio: "15:00",
  horaFin: "16:00",
}

describe("catedras API", () => {
  beforeEach(() => {
    createSupabaseBrowserClientMock.mockReset()
  })

  it("crearCatedra asegura docente e inserta horario", async () => {
    const fake = configure({ catedras: [], docentes: [], perfiles: [{ id: "p1", nombres: "Leo", apellidos: "Brouwer" }], catedra_horarios: [] })
    const calls = track(fake)

    const result = await crearCatedra(CATEDRA_VALUES)

    expect(result).toEqual({ data: { id: expect.any(String) }, error: null })
    expect(calls).toEqual(["docentes", "perfiles", "docentes", "catedras", "catedra_horarios"])
  })

  it("crearCatedra omite horario sin día y horas", async () => {
    const fake = configure({ catedras: [], docentes: [{ perfil_id: "p1" }] })
    const calls = track(fake)

    await crearCatedra({ ...CATEDRA_VALUES, diaSemana: "", horaInicio: "", horaFin: "" })

    expect(calls).toEqual(["docentes", "catedras"])
  })

  it("getCatedraOptions marca admins y lista cursos", async () => {
    const fake = configure({
      perfil_rol: [
        { perfil_id: "p1", rol: "docente" },
        { perfil_id: "p2", rol: "admin" },
      ],
      perfiles: [
        { id: "p1", nombres: "Leo", apellidos: "Brouwer" },
        { id: "p2", nombres: "Ada", apellidos: "Admin" },
      ],
      cursos: [{ id: "k1", nombre: "Guitarra" }],
    })

    const result = await getCatedraOptions(fake)

    expect(result.data!.cursos).toEqual([{ id: "k1", nombre: "Guitarra" }])
    expect(result.data!.docentes.map((d) => d.nombre)).toEqual(["Ada Admin (Admin)", "Leo Brouwer"])
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

  it("generarSesionesCatedra llama al rpc", async () => {
    const rpc = vi.fn(() => 4)
    createSupabaseBrowserClientMock.mockReturnValue(
      createFakeSupabase({}, { rpcResults: { generar_sesiones_catedra: rpc } }),
    )

    const result = await generarSesionesCatedra({ catedraId: "c1", fechaDesde: "2026-06-01", fechaHasta: "2026-06-30" })

    expect(result).toEqual({ data: 4, error: null })
    expect(rpc).toHaveBeenCalledWith({ p_catedra_id: "c1", p_fecha_desde: "2026-06-01", p_fecha_hasta: "2026-06-30" })
  })

  it("updateCatedra asegura docente y actualiza", async () => {
    const fake = configure({ catedras: [{ id: "c1" }], docentes: [{ perfil_id: "p1" }] })
    const calls = track(fake)

    await expect(
      updateCatedra({ id: "c1", cupo_maximo: 12, aula: " A2 ", modalidad: "virtual", docente_id: "p1", estado: "en_curso" }),
    ).resolves.toEqual({ error: null })

    expect(calls).toEqual(["docentes", "catedras"])
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
