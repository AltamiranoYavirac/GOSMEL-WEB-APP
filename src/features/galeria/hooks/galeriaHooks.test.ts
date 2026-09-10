import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const api = vi.hoisted(() => ({
  getGaleria: vi.fn(),
  updateGaleriaPublicado: vi.fn(),
}))

vi.mock("../api/getGaleria", () => ({ getGaleria: api.getGaleria }))
vi.mock("../api/updateGaleriaPublicado", () => ({ updateGaleriaPublicado: api.updateGaleriaPublicado }))
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

import { createQueryWrapper, createTestQueryClient } from "@/test/query"

import { useGaleria } from "./useGaleria"
import { useUpdateGaleriaPublicado } from "./useUpdateGaleriaPublicado"

function wrapper() {
  return createQueryWrapper(createTestQueryClient())
}

describe("galeria hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    for (const fn of Object.values(api)) fn.mockResolvedValue({ data: [], error: null })
  })

  it("query y mutation funcionan", async () => {
    const query = renderHook(() => useGaleria(), { wrapper: wrapper() })
    await waitFor(() => expect(query.result.current.isSuccess).toBe(true))
    query.unmount()

    const { result } = renderHook(() => useUpdateGaleriaPublicado(), { wrapper: wrapper() })
    await act(async () => {
      await result.current.mutateAsync("x" as never)
    })
    expect(api.updateGaleriaPublicado).toHaveBeenCalled()
  })
})
