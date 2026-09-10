import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const api = vi.hoisted(() => ({
  getMetricas: vi.fn(),
  updateMetricaPublicado: vi.fn(),
}))

vi.mock("../api/getMetricas", () => ({ getMetricas: api.getMetricas }))
vi.mock("../api/updateMetricaPublicado", () => ({ updateMetricaPublicado: api.updateMetricaPublicado }))
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

import { createQueryWrapper, createTestQueryClient } from "@/test/query"

import { useMetricas } from "./useMetricas"
import { useUpdateMetricaPublicado } from "./useUpdateMetricaPublicado"

function wrapper() {
  return createQueryWrapper(createTestQueryClient())
}

describe("metricas hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    for (const fn of Object.values(api)) fn.mockResolvedValue({ data: [], error: null })
  })

  it("query y mutation funcionan", async () => {
    const query = renderHook(() => useMetricas(), { wrapper: wrapper() })
    await waitFor(() => expect(query.result.current.isSuccess).toBe(true))
    query.unmount()

    const { result } = renderHook(() => useUpdateMetricaPublicado(), { wrapper: wrapper() })
    await act(async () => {
      await result.current.mutateAsync("x" as never)
    })
    expect(api.updateMetricaPublicado).toHaveBeenCalled()
  })
})
