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
        v_estado_cuenta: [
          {
            cuota_id: "q1",
            periodo_mes: "2026-06",
            estudiante: "Ada Lovelace",
            monto: 100,
            monto_pagado: 30,
            saldo: 70,
            saldo_reservado: 0,
            fecha_vencimiento: "2026-06-05",
            estado: "parcial",
          },
        ],
      }),
    )

    expect(result.data![0]).toMatchObject({ estudiante: "Ada Lovelace", saldo: 70, estado: "parcial" })
  })

  it("crearCuota registra exclusivamente un cargo extraordinario mediante RPC", async () => {
    configure({}, { id: "u1" })
    createSupabaseBrowserClientMock.mockReturnValue(createFakeSupabase({}, { rpcResults: { crear_cargo_extraordinario: { id: "q1" } } }))

    const result = await crearCuota({ estudianteId: "e1", monto: 50, fechaVencimiento: "2026-06-05", concepto: "Materiales" })

    expect(result).toEqual({ data: { id: expect.any(String) }, error: null })
  })

  it("crearCuota exige concepto", async () => {
    configure()
    await expect(crearCuota({ estudianteId: "e1", monto: 50, fechaVencimiento: "2026-06-05" })).resolves.toEqual({ data: null, error: "El concepto del cargo es obligatorio" })
  })

  it("crearCuota propaga errores de la RPC", async () => {
    createSupabaseBrowserClientMock.mockReturnValue(createFakeSupabase.withError("rpc:crear_cargo_extraordinario", "boom cargo", {}))
    await expect(crearCuota({ estudianteId: "e1", monto: 50, fechaVencimiento: "2026-06-05", concepto: "Materiales" })).resolves.toEqual({
      data: null,
      error: "boom cargo",
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
    createSupabaseBrowserClientMock.mockReturnValue(createFakeSupabase.withError("rpc:editar_cuota", "Cuota no encontrada"))

    const result = await updateCuota({ cuotaId: "missing", monto: 10, fechaVencimiento: "2026-06-05" })

    expect(result.data).toBeNull()
    expect(result.error).toBeTruthy()
  })

  it("registrarPago crea un cobro aprobado con una aplicación", async () => {
    createSupabaseBrowserClientMock.mockReturnValue(createFakeSupabase({ cuotas: [{ id: "q1", estudiante_id: "e1", responsable_representante_id: null }] }, { rpcResults: { registrar_cobro: "c1" } }))

    await expect(
      registrarPago("q1", { monto: 50, metodo: "transferencia", fechaPago: "2026-06-01", referencia: " ref ", observacion: "" }),
    ).resolves.toEqual({ data: { id: expect.any(String) }, error: null })

  })

  it("registrarPago propaga errores", async () => {
    createSupabaseBrowserClientMock.mockReturnValue(createFakeSupabase.withError("rpc:registrar_cobro", "boom pago", { cuotas: [{ id: "q1", estudiante_id: "e1", responsable_representante_id: null }] }))

    await expect(
      registrarPago("q1", { monto: 50, metodo: "efectivo", fechaPago: "2026-06-01" }),
    ).resolves.toEqual({ data: null, error: "boom pago" })
  })

  it("reactivarCuota recalcula estado y propaga errores", async () => {
    createSupabaseBrowserClientMock.mockReturnValue(createFakeSupabase({}, { rpcResults: { restaurar_cuota_condonada: null } }))
    await expect(reactivarCuota("q1")).resolves.toEqual({ error: null })

    createSupabaseBrowserClientMock.mockReturnValue(createFakeSupabase({}, { rpcResults: { restaurar_cuota_condonada: null } }))
    await expect(reactivarCuota("q1")).resolves.toEqual({ error: null })

    createSupabaseBrowserClientMock.mockReturnValue(createFakeSupabase.withError("rpc:restaurar_cuota_condonada", "Cuota no encontrada"))
    const missing = await reactivarCuota("missing")
    expect(missing.error).toBeTruthy()
  })

  it("condonarCuota y eliminarCuota responden", async () => {
    createSupabaseBrowserClientMock.mockReturnValue(createFakeSupabase({}, { rpcResults: { condonar_cuota: null, anular_cuota: null } }))
    await expect(condonarCuota("q1", "Beca")).resolves.toEqual({ error: null })
    await expect(eliminarCuota("q1", "Error administrativo")).resolves.toEqual({ error: null })
  })
})
