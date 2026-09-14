import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { createFakeSupabase } from "@/test/supabase"

import { getCobranza } from "./getCobranza"

function buildTables() {
  return {
    v_cobranza_responsables: [{ responsable_id: "r1", responsable: "Grace Hopper", responsable_tipo: "representante", celular: "0991234567", estudiantes_con_cargo: 2, saldo_total: 130, saldo_mes: 30, dias_mora_max: 71 }],
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
    const tables = { v_cobranza_responsables: [{ responsable_id: "r1", responsable: "Grace Hopper", responsable_tipo: "representante", celular: "099", estudiantes_con_cargo: 1, saldo_total: 0, saldo_mes: 0, dias_mora_max: null }] }

    const result = await getCobranza(createFakeSupabase(tables))

    expect(result.data![0].saldoTotal).toBe(0)
    expect(result.data![0].diasMoraMax).toBeNull()
  })

  it("propaga el primer error de cualquier query", async () => {
    const result = await getCobranza(
      createFakeSupabase.withError("v_cobranza_responsables", "boom", buildTables()),
    )

    expect(result).toEqual({ data: null, error: "boom" })
  })
})
