import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const { createSupabaseBrowserClientMock } = vi.hoisted(() => ({
  createSupabaseBrowserClientMock: vi.fn(),
}))

vi.mock("@/shared/api/supabase/client", () => ({
  createSupabaseBrowserClient: createSupabaseBrowserClientMock,
}))

import { createFakeSupabase } from "@/test/supabase"

import { createEstudiante } from "./createEstudiante"
import { darDeBajaEstudiante } from "./darDeBajaEstudiante"
import { eliminarEstudiante } from "./eliminarEstudiante"
import { eliminarInscripcion } from "./eliminarInscripcion"
import { getEstudianteDetalle } from "./getEstudianteDetalle"
import { getEstudiantes } from "./getEstudiantes"
import { inscribirEstudianteCatedra } from "./inscribirEstudianteCatedra"
import { updateEstudiante } from "./updateEstudiante"
import { updateInscripcionEstado } from "./updateInscripcionEstado"

function configure(tables: Record<string, Record<string, unknown>[]> = {}) {
  const fake = createFakeSupabase(tables)
  createSupabaseBrowserClientMock.mockReturnValue(fake)
  return fake
}

const ESTUDIANTE_FORM = {
  nombres: "  Ada  ",
  apellidos: "Lovelace",
  fechaNacimiento: "2015-06-15",
  nivel: "intermedio",
  cedula: "",
  celular: "",
  email: "",
  activo: true,
}

describe("estudiantes read APIs", () => {
  beforeEach(() => {
    createSupabaseBrowserClientMock.mockReset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("getEstudiantes calcula edad, representante, instrumentos y cátedras", async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 5, 15, 12))

    const fake = createFakeSupabase({
      perfil_rol: [{ perfil_id: "p1", rol: "estudiante" }],
      estudiantes: [
        {
          id: "e1",
          perfil_id: "p1",
          nombres: "Ada",
          apellidos: "Lovelace",
          cedula: "123",
          celular: null,
          email: "ada@x.com",
          fecha_nacimiento: "2000-06-16T12:00:00",
          nivel_musical: "intermedio",
          activo: true,
          estudiante_instrumento: [{ instrumentos: { nombre: "Guitarra" } }, { instrumentos: null }],
          estudiante_representante: [
            { es_contacto_principal: true, representantes: { nombres: "Grace", apellidos: "Hopper" } },
          ],
          inscripciones: [
            {
              id: "i1",
              estado: "activa",
              catedra_id: "c1",
              catedras: {
                id: "c1",
                codigo: "C-01",
                cursos: { nombre: "Guitarra" },
                docentes: { perfiles: { nombres: "Leo", apellidos: "Brouwer" } },
              },
            },
            { id: "i2", estado: "retirada", catedra_id: "c2", catedras: null },
          ],
        },
      ],
    })

    const result = await getEstudiantes(fake)

    expect(result.error).toBeNull()
    expect(result.data![0]).toMatchObject({
      nombreCompleto: "Ada Lovelace",
      edad: 25,
      instrumentos: ["Guitarra"],
      representante: "Grace Hopper",
      activo: true,
    })
    expect(result.data![0].catedrasActivas).toHaveLength(1)
    expect(result.data![0].catedrasActivas[0].docenteNombre).toBe("Leo Brouwer")
  })

  it("getEstudianteDetalle mapea cuotas ordenadas y vínculos", async () => {
    const result = await getEstudianteDetalle(
      "e1",
      createFakeSupabase({
        estudiantes: [
          {
            id: "e1",
            nombres: "Ada",
            apellidos: "Lovelace",
            email: "ada@x.com",
            cedula: null,
            celular: null,
            fecha_nacimiento: "2010-01-01",
            activo: true,
            estudiante_instrumento: [{ instrumentos: { nombre: "Piano" } }],
            estudiante_representante: [{ es_contacto_principal: false, representantes: { nombres: "Grace", apellidos: "Hopper" } }],
          },
        ],
        inscripciones: [
          {
            id: "i1",
            estudiante_id: "e1",
            estado: "activa",
            catedra_id: "c1",
            catedras: {
              codigo: "C-01",
              cursos: { nombre: "Guitarra" },
              docentes: { perfiles: { nombres: "Leo", apellidos: "Brouwer" } },
            },
          },
        ],
        acuerdos_pago: [
          {
            id: "a1",
            estudiante_id: "e1",
            cuotas: [
              { id: "q1", periodo_mes: "2026-01", monto: 50, monto_pagado: 50, fecha_vencimiento: "2026-01-05", estado: "pagada" },
              { id: "q2", periodo_mes: "2026-02", monto: 50, monto_pagado: 20, fecha_vencimiento: "2026-02-05", estado: "parcial" },
            ],
          },
        ],
      }),
    )

    expect(result.data).toMatchObject({ nombre: "Ada Lovelace", representante: "Grace Hopper", instrumentos: ["Piano"] })
    expect(result.data!.inscripciones[0]).toMatchObject({ catedra: "C-01", curso: "Guitarra", docenteNombre: "Leo Brouwer" })
    expect(result.data!.cuotas.map((cuota) => cuota.id)).toEqual(["q2", "q1"])
    expect(result.data!.cuotas[0].saldo).toBe(30)
  })

  it("getEstudianteDetalle devuelve null si no existe", async () => {
    const result = await getEstudianteDetalle("missing", createFakeSupabase({ estudiantes: [] }))

    expect(result).toEqual({ data: null, error: null })
  })
})

describe("estudiantes write APIs", () => {
  beforeEach(() => {
    createSupabaseBrowserClientMock.mockReset()
  })

  it("createEstudiante inserta ficha, vínculo e instrumento", async () => {
    const fake = configure({ estudiantes: [], estudiante_representante: [], estudiante_instrumento: [] })
    const calls: string[] = []
    const original = fake.from.bind(fake) as (table: string) => unknown
    fake.from = ((table: string) => {
      calls.push(table)
      return original(table)
    }) as unknown as typeof fake.from

    const result = await createEstudiante({
      nombres: " Ada ",
      apellidos: " Lovelace ",
      fecha_nacimiento: "2015-06-15",
      cedula: " 123 ",
      celular: "",
      email: " ada@x.com ",
      nivel_musical: "intermedio",
      representante_id: "r1",
      parentesco: "madre",
      instrumento_id: "i1",
    })

    expect(result.error).toBeNull()
    expect(result.data).toEqual({ id: expect.any(String) })
    expect(calls).toEqual(["estudiantes", "estudiante_representante", "estudiante_instrumento"])
  })

  it("createEstudiante propaga error de inserción", async () => {
    createSupabaseBrowserClientMock.mockReturnValue(createFakeSupabase.withError("estudiantes", "boom"))

    const result = await createEstudiante({ nombres: "Ada", apellidos: "Lovelace", fecha_nacimiento: "2015-06-15" })

    expect(result).toEqual({ data: null, error: "boom" })
  })

  it("updateEstudiante responde con id", async () => {
    configure({ estudiantes: [{ id: "e1" }] })

    await expect(updateEstudiante("e1", ESTUDIANTE_FORM)).resolves.toEqual({ data: { id: "e1" }, error: null })
  })

  it("eliminarEstudiante desactiva si hay historial y borra si no", async () => {
    configure({ inscripciones: [{ id: "i1", estudiante_id: "e1" }], acuerdos_pago: [], perfil_rol: [] })
    await expect(eliminarEstudiante("e1", "p1")).resolves.toEqual({ data: { deleted: false }, error: null })

    configure({
      inscripciones: [],
      acuerdos_pago: [],
      perfil_rol: [],
      estudiantes: [{ id: "e1" }],
      estudiante_representante: [],
      estudiante_instrumento: [],
      registros_practica: [],
      actividades: [],
      curso_resenas: [],
    })
    await expect(eliminarEstudiante("e1", "p1")).resolves.toEqual({ data: { deleted: true }, error: null })
  })

  it("eliminarEstudiante propaga error de conteo", async () => {
    createSupabaseBrowserClientMock.mockReturnValue(createFakeSupabase.withError("acuerdos_pago", "boom"))

    await expect(eliminarEstudiante("e1", null)).resolves.toEqual({ data: null, error: "boom" })
  })

  it("eliminarInscripcion limpia acuerdos y cuotas", async () => {
    configure({
      acuerdos_pago: [{ id: "a1", inscripcion_id: "i1" }],
      cuotas: [{ id: "q1", acuerdo_id: "a1", monto_pagado: 0 }],
      inscripciones: [{ id: "i1" }],
    })

    await expect(eliminarInscripcion("i1")).resolves.toEqual({ data: { id: "i1" }, error: null })

    configure({ acuerdos_pago: [], inscripciones: [{ id: "i2" }] })
    await expect(eliminarInscripcion("i2")).resolves.toEqual({ data: { id: "i2" }, error: null })
  })

  it("inscribirEstudianteCatedra llama al rpc con defaults", async () => {
    const rpc = vi.fn(() => "insc-1")
    configure()
    createSupabaseBrowserClientMock.mockReturnValue(
      createFakeSupabase({}, { rpcResults: { matricular_estudiante_directo: rpc } }),
    )

    const result = await inscribirEstudianteCatedra({ estudianteId: "e1", catedraId: "c1", motivoAjuste: "  " })

    expect(result).toEqual({ data: { inscripcionId: "insc-1" }, error: null })
    expect(rpc).toHaveBeenCalledWith({
      p_estudiante_id: "e1",
      p_catedra_id: "c1",
      p_monto_mensual: 0,
      p_dia_cobro: 5,
      p_motivo_ajuste: undefined,
      p_monto_primer_mes: undefined,
    })
  })

  it("inscribirEstudianteCatedra propaga error del rpc", async () => {
    createSupabaseBrowserClientMock.mockReturnValue(createFakeSupabase({}, { rpcError: "boom" }))

    await expect(inscribirEstudianteCatedra({ estudianteId: "e1", catedraId: "c1" })).resolves.toEqual({
      data: null,
      error: "boom",
    })
  })

  it("updateInscripcionEstado y darDeBajaEstudiante responden", async () => {
    configure({ inscripciones: [{ id: "i1" }] })
    await expect(updateInscripcionEstado("i1", "retirada")).resolves.toEqual({ data: { id: "i1" }, error: null })

    configure()
    await expect(darDeBajaEstudiante({ inscripcionId: "i1" })).resolves.toEqual({ error: null })

    createSupabaseBrowserClientMock.mockReturnValue(createFakeSupabase({}, { rpcError: "boom baja" }))
    await expect(darDeBajaEstudiante({ inscripcionId: "i1", motivo: "x" })).resolves.toEqual({ error: "boom baja" })
  })
})
