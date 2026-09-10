import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { createFakeSupabase } from "@/test/supabase"

import { getCobranza } from "./getCobranza"

function buildTables() {
  return {
    estudiantes: [
      { id: "e1", perfil_id: "p1", nombres: "Ada", apellidos: "Lovelace" },
      { id: "e2", perfil_id: "p2", nombres: "Alan", apellidos: "Turing" },
    ],
    estudiante_representante: [
      { representante_id: "r1", estudiante_id: "e1" },
      { representante_id: "r1", estudiante_id: "e2" },
    ],
    representantes: [
      { id: "r1", nombres: "Grace", apellidos: "Hopper", celular: "0991234567" },
      { id: "r2", nombres: "Sin", apellidos: "Hijos", celular: null },
    ],
    acuerdos_pago: [
      {
        estudiante_id: "e1",
        cuotas: [
          { periodo_mes: "2026-06", monto: 50, monto_pagado: 20, fecha_vencimiento: "2026-06-05", estado: "parcial" },
          { periodo_mes: "2026-05", monto: 50, monto_pagado: 50, fecha_vencimiento: "2026-05-05", estado: "pagada" },
          { periodo_mes: "2026-04", monto: 50, monto_pagado: 0, fecha_vencimiento: "2026-04-05", estado: "pendiente" },
          { periodo_mes: "2026-03", monto: 50, monto_pagado: 0, fecha_vencimiento: null, estado: "pendiente" },
        ],
      },
      {
        estudiante_id: "e2",
        cuotas: [
          { periodo_mes: "2026-06", monto: 30, monto_pagado: 0, fecha_vencimiento: "2026-06-10", estado: "condonada" },
        ],
      },
    ],
  }
}

describe("getCobranza", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 5, 15, 12, 0, 0))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("agrega solo cuotas pendientes/parciales y excluye representantes sin vínculos", async () => {
    const result = await getCobranza(createFakeSupabase(buildTables()))

    expect(result.error).toBeNull()
    expect(result.data).toHaveLength(1)

    const row = result.data![0]
    expect(row.id).toBe("r1")
    expect(row.representante).toBe("Grace Hopper")
    expect(row.celular).toBe("0991234567")
    expect(row.hijosConCuota).toBe(2)
    expect(row.saldoTotal).toBe(130)
    expect(row.totalMes).toBe(30)
    expect(row.diasMoraMax).toBe(71)
    expect(row.periodoMes).toBe("2026-06-01")
  })

  it("devuelve diasMoraMax null si nada está vencido", async () => {
    const tables = buildTables()
    tables.acuerdos_pago = [
      {
        estudiante_id: "e1",
        cuotas: [
          { periodo_mes: "2026-06", monto: 50, monto_pagado: 50, fecha_vencimiento: "2026-06-05", estado: "pagada" },
        ],
      },
    ]

    const result = await getCobranza(createFakeSupabase(tables))

    expect(result.data![0].saldoTotal).toBe(0)
    expect(result.data![0].diasMoraMax).toBeNull()
  })

  it("propaga el primer error de cualquier query", async () => {
    const result = await getCobranza(
      createFakeSupabase.withError("representantes", "boom", buildTables()),
    )

    expect(result).toEqual({ data: null, error: "boom" })
  })
})
