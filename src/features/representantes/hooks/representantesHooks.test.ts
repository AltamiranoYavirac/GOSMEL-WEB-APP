import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const api = vi.hoisted(() => ({
  getRepresentantes: vi.fn(),
  getRepresentanteDetalle: vi.fn(),
  createRepresentante: vi.fn(),
  updateRepresentante: vi.fn(),
}))

vi.mock("../api/getRepresentantes", () => ({ getRepresentantes: api.getRepresentantes }))
vi.mock("../api/getRepresentanteDetalle", () => ({ getRepresentanteDetalle: api.getRepresentanteDetalle }))
vi.mock("../api/createRepresentante", () => ({ createRepresentante: api.createRepresentante }))
vi.mock("../api/updateRepresentante", () => ({ updateRepresentante: api.updateRepresentante }))
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

import { createQueryWrapper, createTestQueryClient } from "@/test/query"

import { useCreateRepresentante } from "./useCreateRepresentante"
import { useRepresentanteDetalle } from "./useRepresentanteDetalle"
import { useUpdateRepresentante } from "./useUpdateRepresentante"

function wrapper() {
  return createQueryWrapper(createTestQueryClient())
}

describe("representantes hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    for (const fn of Object.values(api)) fn.mockResolvedValue({ data: [], error: null })
  })

  it("las queries resuelven", async () => {
    const { result } = renderHook(() => useRepresentanteDetalle("r1"), { wrapper: wrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const disabled = renderHook(() => useRepresentanteDetalle(null), { wrapper: wrapper() })
    expect(disabled.result.current.fetchStatus).toBe("idle")
  })

  it("las mutations llaman a la api", async () => {
    const cases: Array<[() => { mutateAsync: (v: never) => Promise<unknown> }, ReturnType<typeof vi.fn>]> = [
      [useCreateRepresentante, api.createRepresentante],
      [useUpdateRepresentante, api.updateRepresentante],
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
