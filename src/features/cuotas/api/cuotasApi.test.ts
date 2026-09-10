import { beforeEach, describe, expect, it } from "vitest"

const { createSupabaseBrowserClientMock } = vi.hoisted(() => ({
  createSupabaseBrowserClientMock: vi.fn(),
}))

vi.mock("@/shared/api/supabase/client", () => ({
  createSupabaseBrowserClient: createSupabaseBrowserClientMock,
}))

import { createFakeSupabase } from "@/test/supabase"
import type { TFakeSupabaseClient } from "@/test/supabase.types"

import { condonarCuota } from "./condonarCuota"
import { crearCuota } from "./crearCuota"
import { eliminarCuota } from "./eliminarCuota"
import { getCuotas } from "./getCuotas"
import { reactivarCuota } from "./reactivarCuota"
import { registrarPago } from "./registrarPago"
import { updateCuota } from "./updateCuota"

function configure(
  tables: Record<string, Record<string, unknown>[]> = {},
  user: { id: string } | null = { id: "u1" },
): TFakeSupabaseClient {
  const fake = createFakeSupabase(tables, { user: user ?? undefined })
  createSupabaseBrowserClientMock.mockReturnValue(fake)
  return fake
}

describe("cuotas API", () => {
  beforeEach(() => {
    createSupabaseBrowserClientMock.mockReset()
  })

  it("getCuotas mapea estudiante y saldo", async () => {
    const result = await getCuotas(
      createFakeSupabase({
        cuotas: [
          {
            id: "q1",
            periodo_mes: "2026-06",
            monto: 100,
            monto_pagado: 30,
            fecha_vencimiento: "2026-06-05",
            estado: "parcial",
            acuerdo_id: "a1",
            acuerdos_pago: { estudiante_id: "e1", estudiantes: { nombres: "Ada", apellidos: "Lovelace" } },
          },
        ],
      }),
    )

    expect(result.data![0]).toMatchObject({ estudiante: "Ada Lovelace", saldo: 70, estado: "parcial" })
  })

  it("crearCuota reutiliza el acuerdo vigente", async () => {
    configure({ acuerdos_pago: [{ id: "a1", estudiante_id: "e1", estado: "vigente" }], cuotas: [] })

    const result = await crearCuota({ estudianteId: "e1", monto: 50, periodo: "2026-06", fechaVencimiento: "2026-06-05" })

    expect(result).toEqual({ data: { id: expect.any(String) }, error: null })
  })

  it("crearCuota crea un acuerdo cuando no existe", async () => {
    const fake = configure({ acuerdos_pago: [], cuotas: [] })
    const calls: string[] = []
    const original = fake.from.bind(fake) as (table: string) => unknown
    fake.from = ((table: string) => {
      calls.push(table)
      return original(table)
    }) as unknown as typeof fake.from

    const result = await crearCuota({ estudianteId: "e1", monto: 50, periodo: "2026-06-01", fechaVencimiento: "2026-06-05" })

    expect(result.error).toBeNull()
    expect(calls).toEqual(["acuerdos_pago", "acuerdos_pago", "cuotas"])
  })

  it("crearCuota propaga errores de acuerdo y de cuota", async () => {
    createSupabaseBrowserClientMock.mockReturnValue(createFakeSupabase.withError("cuotas", "boom cuota", {}))
    await expect(crearCuota({ estudianteId: "e1", monto: 50, periodo: "2026-06", fechaVencimiento: "2026-06-05" })).resolves.toEqual({
      data: null,
      error: "boom cuota",
    })

    configure({ acuerdos_pago: [] })
    createSupabaseBrowserClientMock.mockReturnValue(
      createFakeSupabase.withError("acuerdos_pago", "boom acuerdo", { acuerdos_pago: [], cuotas: [] }),
    )
    await expect(crearCuota({ estudianteId: "e1", monto: 50, periodo: "2026-06", fechaVencimiento: "2026-06-05" })).resolves.toEqual({
      data: null,
      error: "boom acuerdo",
    })
  })

  it("updateCuota recalcula el estado según lo pagado", async () => {
    configure({ cuotas: [{ id: "q1", monto: 100, monto_pagado: 100, estado: "pendiente" }] })
    await expect(updateCuota({ cuotaId: "q1", monto: 100, fechaVencimiento: "2026-06-05" })).resolves.toEqual({
      data: { id: "q1" },
      error: null,
    })

    configure({ cuotas: [{ id: "q1", monto: 200, monto_pagado: 50, estado: "pendiente" }] })
    await expect(updateCuota({ cuotaId: "q1", monto: 200, fechaVencimiento: "2026-06-05" })).resolves.toEqual({
      data: { id: "q1" },
      error: null,
    })

    configure({ cuotas: [{ id: "q1", monto: 200, monto_pagado: 0, estado: "pagada" }] })
    await expect(updateCuota({ cuotaId: "q1", monto: 200, fechaVencimiento: "2026-06-05" })).resolves.toEqual({
      data: { id: "q1" },
      error: null,
    })
  })

  it("updateCuota responde error si no existe", async () => {
    configure({ cuotas: [] })

    const result = await updateCuota({ cuotaId: "missing", monto: 10, fechaVencimiento: "2026-06-05" })

    expect(result.data).toBeNull()
    expect(result.error).toBeTruthy()
  })

  it("registrarPago suma pagos y marca pagada o parcial", async () => {
    configure({ pagos: [], cuotas: [{ id: "q1", monto: 100 }] })

    await expect(
      registrarPago("q1", { monto: 50, metodo: "transferencia", fechaPago: "2026-06-01", referencia: " ref ", observacion: "" }),
    ).resolves.toEqual({ data: { id: expect.any(String) }, error: null })

    const fake = configure({ pagos: [{ id: "p1", cuota_id: "q1", monto: 100 }], cuotas: [{ id: "q1", monto: 100 }] })
    expect(fake).toBeTruthy()
    await expect(
      registrarPago("q1", { monto: 100, metodo: "efectivo", fechaPago: "2026-06-02" }),
    ).resolves.toEqual({ data: { id: expect.any(String) }, error: null })
  })

  it("registrarPago propaga errores", async () => {
    createSupabaseBrowserClientMock.mockReturnValue(createFakeSupabase.withError("pagos", "boom pago", {}, { user: { id: "u1" } }))

    await expect(
      registrarPago("q1", { monto: 50, metodo: "efectivo", fechaPago: "2026-06-01" }),
    ).resolves.toEqual({ data: null, error: "boom pago" })
  })

  it("reactivarCuota recalcula estado y propaga errores", async () => {
    configure({ pagos: [{ monto: 100, cuota_id: "q1" }], cuotas: [{ id: "q1", monto: 100 }] })
    await expect(reactivarCuota("q1")).resolves.toEqual({ error: null })

    configure({ pagos: [{ monto: 30, cuota_id: "q1" }], cuotas: [{ id: "q1", monto: 100 }] })
    await expect(reactivarCuota("q1")).resolves.toEqual({ error: null })

    configure({ pagos: [], cuotas: [] })
    const missing = await reactivarCuota("missing")
    expect(missing.error).toBeTruthy()
  })

  it("condonarCuota y eliminarCuota responden", async () => {
    configure({ cuotas: [{ id: "q1", monto_pagado: 0 }] })
    await expect(condonarCuota("q1")).resolves.toEqual({ error: null })
    await expect(eliminarCuota("q1")).resolves.toEqual({ error: null })

    configure({ cuotas: [{ id: "q1", monto_pagado: 50 }] })
    const blocked = await eliminarCuota("q1")
    expect(blocked.error).toContain("No se puede eliminar una cuota")
  })
})
