import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const api = vi.hoisted(() => ({
  getPagos: vi.fn(),
  aprobarPago: vi.fn(),
  rechazarPago: vi.fn(),
  anularPago: vi.fn(),
}))

vi.mock("../api/getPagos", () => ({ getPagos: api.getPagos }))
vi.mock("../api/aprobarPago", () => ({ aprobarPago: api.aprobarPago }))
vi.mock("../api/rechazarPago", () => ({ rechazarPago: api.rechazarPago }))
vi.mock("../api/anularPago", () => ({ anularPago: api.anularPago }))
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

import { createQueryWrapper, createTestQueryClient } from "@/test/query"

import { useAnularPago } from "./useAnularPago"
import { useAprobarPago } from "./useAprobarPago"
import { usePagos } from "./usePagos"
import { useRechazarPago } from "./useRechazarPago"

function wrapper() {
  return createQueryWrapper(createTestQueryClient())
}

describe("pagos hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    for (const fn of Object.values(api)) fn.mockResolvedValue({ data: [], error: null })
  })

  it("la query resuelve", async () => {
    const { result } = renderHook(() => usePagos(), { wrapper: wrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it("las mutations llaman a la api", async () => {
    const cases: Array<[() => { mutateAsync: (v: never) => Promise<unknown> }, ReturnType<typeof vi.fn>]> = [
      [useAprobarPago, api.aprobarPago],
      [useRechazarPago, api.rechazarPago],
      [useAnularPago, api.anularPago],
    ]

    for (const [hook, expected] of cases) {
      const { result, unmount } = renderHook(hook, { wrapper: wrapper() })
      await act(async () => {
        await result.current.mutateAsync("x" as never)
      })
      expect(expected).toHaveBeenCalled()
      unmount()
    }
  })
})
