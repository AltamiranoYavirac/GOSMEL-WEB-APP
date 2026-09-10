import { renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const api = vi.hoisted(() => ({
  getTopbarSummary: vi.fn(),
  searchEntities: vi.fn(),
}))

vi.mock("../api", () => ({
  getTopbarSummary: api.getTopbarSummary,
  searchEntities: api.searchEntities,
}))

import { createQueryWrapper, createTestQueryClient } from "@/test/query"

import { useEntitySearch } from "./useEntitySearch"
import { useTopbarSummary } from "./useTopbarSummary"

function wrapper() {
  return createQueryWrapper(createTestQueryClient())
}

describe("dashboard-topbar hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    for (const fn of Object.values(api)) fn.mockResolvedValue({ data: null, error: null })
  })

  it("useTopbarSummary resuelve", async () => {
    const { result } = renderHook(() => useTopbarSummary(), { wrapper: wrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it("useEntitySearch debouncea y no consulta con menos de 2 letras", async () => {
    const short = renderHook(() => useEntitySearch("a"), { wrapper: wrapper() })
    expect(short.result.current.fetchStatus).toBe("idle")
    short.unmount()

    const { result } = renderHook(() => useEntitySearch("ada"), { wrapper: wrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true), { timeout: 3000 })
    expect(api.searchEntities).toHaveBeenCalled()
  })
})
