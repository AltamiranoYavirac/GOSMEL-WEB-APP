import { beforeEach, describe, expect, it, vi } from "vitest"

const { createSupabaseBrowserClientMock } = vi.hoisted(() => ({
  createSupabaseBrowserClientMock: vi.fn(),
}))

vi.mock("@/shared/api/supabase/client", () => ({
  createSupabaseBrowserClient: createSupabaseBrowserClientMock,
}))

import { createFakeSupabase } from "@/test/supabase"

import { generarCuotasMes } from "./generarCuotasMes"

describe("generarCuotasMes", () => {
  beforeEach(() => {
    createSupabaseBrowserClientMock.mockReset()
  })

  it("normaliza el mes a día 1 y devuelve el conteo", async () => {
    const rpc = vi.fn(() => 5)
    createSupabaseBrowserClientMock.mockReturnValue(
      createFakeSupabase({}, { rpcResults: { generar_cuotas_mes: rpc } }),
    )

    const result = await generarCuotasMes("2026-06")

    expect(result).toEqual({ data: 5, error: null })
    expect(rpc).toHaveBeenCalledWith({ p_mes: "2026-06-01" })
  })

  it("respeta un mes que ya trae día", async () => {
    const rpc = vi.fn(() => 0)
    createSupabaseBrowserClientMock.mockReturnValue(
      createFakeSupabase({}, { rpcResults: { generar_cuotas_mes: rpc } }),
    )

    await generarCuotasMes("2026-06-01")

    expect(rpc).toHaveBeenCalledWith({ p_mes: "2026-06-01" })
  })

  it("convierte null a 0", async () => {
    createSupabaseBrowserClientMock.mockReturnValue(
      createFakeSupabase({}, { rpcResults: { generar_cuotas_mes: null } }),
    )

    const result = await generarCuotasMes("2026-06")

    expect(result).toEqual({ data: 0, error: null })
  })

  it("propaga el error del rpc", async () => {
    createSupabaseBrowserClientMock.mockReturnValue(
      createFakeSupabase({}, { rpcError: "boom" }),
    )

    const result = await generarCuotasMes("2026-06")

    expect(result).toEqual({ data: null, error: "boom" })
  })
})
