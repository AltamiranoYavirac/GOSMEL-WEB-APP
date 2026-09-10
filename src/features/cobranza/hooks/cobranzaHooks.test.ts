import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const api = vi.hoisted(() => ({
  getCobranza: vi.fn(),
  getCuotasPendientesFamilia: vi.fn(),
  registrarPagoFamiliar: vi.fn(),
}))

vi.mock("../api/getCobranza", () => ({ getCobranza: api.getCobranza }))
vi.mock("../api/getCuotasPendientesFamilia", () => ({ getCuotasPendientesFamilia: api.getCuotasPendientesFamilia }))
vi.mock("../api/registrarPagoFamiliar", () => ({ registrarPagoFamiliar: api.registrarPagoFamiliar }))
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

import { createQueryWrapper, createTestQueryClient } from "@/test/query"

import { useCobranza } from "./useCobranza"
import { useCuotasPendientesFamilia } from "./useCuotasPendientesFamilia"
import { useRegistrarPagoFamiliar } from "./useRegistrarPagoFamiliar"

function wrapper() {
  return createQueryWrapper(createTestQueryClient())
}

describe("cobranza hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    for (const fn of Object.values(api)) fn.mockResolvedValue({ data: [], error: null })
  })

  it("las queries resuelven", async () => {
    const hooks: Array<() => { isSuccess: boolean }> = [() => useCobranza(), () => useCuotasPendientesFamilia("r1")]

    for (const hook of hooks) {
      const { result, unmount } = renderHook(hook, { wrapper: wrapper() })
      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      unmount()
    }
  })

  it("la mutation llama a la api", async () => {
    const { result } = renderHook(() => useRegistrarPagoFamiliar(), { wrapper: wrapper() })
    await act(async () => {
      await result.current.mutateAsync("x" as never)
    })
    expect(api.registrarPagoFamiliar).toHaveBeenCalled()
  })
})
