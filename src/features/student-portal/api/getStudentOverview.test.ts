import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { createFakeSupabase } from "@/test/supabase"
import { toLocalDateString } from "@/shared/lib/date"

import { getStudentOverview } from "./getStudentOverview"

const MONDAY = "2026-06-15"

function buildTables() {
  return {
    inscripciones: [
      { estudiante_id: "e1", catedra_id: "c1", estado: "activa" },
      { estudiante_id: "e1", catedra_id: "c2", estado: "activa" },
      { estudiante_id: "e1", catedra_id: "c3", estado: "inactiva" },
    ],
    v_promedio_academico: [
      { estudiante_id: "e1", promedio_sobre_10: 8, evaluaciones_rendidas: 2 },
      { estudiante_id: "e1", promedio_sobre_10: 6, evaluaciones_rendidas: 3 },
    ],
    v_estado_cuenta: [
      { estudiante_id: "e1", estado_efectivo: "vencida", saldo: 30, monto: 50, monto_pagado: 20, cuota_id: "q1" },
      { estudiante_id: "e1", estado_efectivo: "pagada", saldo: 0, monto: 50, monto_pagado: 50, cuota_id: "q2" },
      { estudiante_id: "e1", estado_efectivo: "pendiente", saldo: 20, monto: 50, monto_pagado: 30, cuota_id: "q3" },
    ],
    registros_practica: [
      { estudiante_id: "e1", minutos: 30, fecha: MONDAY },
      { estudiante_id: "e1", minutos: 120, fecha: "2026-06-10" },
    ],
    actividades: [
      {
        id: "a1",
        estudiante_id: "e1",
        tipo: "logro",
        titulo: "Primera canción",
        descripcion: "Completó su primera pieza",
        created_at: "2026-06-14T10:00:00",
      },
    ],
    sesiones: [
      {
        id: "s1",
        catedra_id: "c1",
        estado: "programada",
        fecha: "2026-06-16",
        hora_inicio: "15:00",
        hora_fin: "16:00",
        tema: "Escalas",
        catedras: {
          codigo: "C-01",
          aula: "A1",
          modalidad: "presencial",
          cursos: { nombre: "Guitarra" },
          docentes: { perfiles: { nombres: "Leo", apellidos: "Brouwer" } },
        },
      },
    ],
  }
}

describe("getStudentOverview", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 5, 15, 12))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("agrega promedio, pagos, práctica, actividades y próxima clase", async () => {
    const result = await getStudentOverview("e1", createFakeSupabase(buildTables()))

    expect(result.error).toBeNull()
    expect(result.data).toMatchObject({
      promedioSobre10: 7,
      evaluacionesRendidas: 5,
      practicaSemanalMinutos: 30,
      estadoPagos: "cuota_vencida",
      saldoPendiente: 50,
      cuotasVencidas: 1,
    })

    expect(result.data!.proximaClase).toMatchObject({
      sesionId: "s1",
      catedra: "C-01",
      curso: "Guitarra",
      docente: "Leo Brouwer",
      modalidad: "presencial",
    })

    expect(result.data!.actividades).toEqual([
      {
        id: "a1",
        tipo: "logro",
        titulo: "Primera canción",
        descripcion: "Completó su primera pieza",
        creadaEn: "2026-06-14T10:00:00",
      },
    ])
  })

  it("calcula el lunes de la semana con getDay() === 0", async () => {
    vi.setSystemTime(new Date(2026, 5, 14, 12))
    const domingo = new Date(2026, 5, 14)
    const lunesEsperado = toLocalDateString(new Date(2026, 5, 8))
    expect(domingo.getDay()).toBe(0)

    const result = await getStudentOverview(
      "e1",
      createFakeSupabase({
        ...buildTables(),
        registros_practica: [
          { estudiante_id: "e1", minutos: 25, fecha: lunesEsperado },
          { estudiante_id: "e1", minutos: 60, fecha: "2026-06-07" },
        ],
      }),
    )

    expect(result.data!.practicaSemanalMinutos).toBe(25)
  })

  it("marca por_vencer y al_dia según la vista de cuenta", async () => {
    const tables = buildTables()
    tables.v_estado_cuenta = [
      { estudiante_id: "e1", estado_efectivo: "pendiente", saldo: 20, monto: 50, monto_pagado: 30, cuota_id: "q1" },
    ]

    const porVencer = await getStudentOverview("e1", createFakeSupabase(tables))
    expect(porVencer.data!.estadoPagos).toBe("por_vencer")

    tables.v_estado_cuenta = [
      { estudiante_id: "e1", estado_efectivo: "pagada", saldo: 0, monto: 50, monto_pagado: 50, cuota_id: "q1" },
    ]
    const alDia = await getStudentOverview("e1", createFakeSupabase(tables))
    expect(alDia.data!.estadoPagos).toBe("al_dia")
    expect(alDia.data!.saldoPendiente).toBe(0)
  })

  it("funciona sin inscripciones ni próxima clase", async () => {
    const tables = buildTables()
    tables.inscripciones = []
    tables.sesiones = []

    const result = await getStudentOverview("e1", createFakeSupabase(tables))

    expect(result.data!.proximaClase).toBeNull()
    expect(result.data!.promedioSobre10).toBe(7)
  })

  it("propaga el error de inscripciones y de queries agregadas", async () => {
    expect(await getStudentOverview("e1", createFakeSupabase.withError("inscripciones", "boom"))).toEqual({
      data: null,
      error: "boom",
    })

    await expect(
      getStudentOverview("e1", createFakeSupabase.withError("actividades", "boom", buildTables())),
    ).resolves.toEqual({ data: null, error: "boom" })
  })
})
