import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const api = vi.hoisted(() => ({
  getSecciones: vi.fn(),
  updateSeccionPublicado: vi.fn(),
}))

vi.mock("../api/getSecciones", () => ({ getSecciones: api.getSecciones }))
vi.mock("../api/updateSeccionPublicado", () => ({ updateSeccionPublicado: api.updateSeccionPublicado }))
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

import { createQueryWrapper, createTestQueryClient } from "@/test/query"

import { useSecciones } from "./useSecciones"
import { useUpdateSeccionPublicado } from "./useUpdateSeccionPublicado"

function wrapper() {
  return createQueryWrapper(createTestQueryClient())
}

describe("secciones hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    for (const fn of Object.values(api)) fn.mockResolvedValue({ data: [], error: null })
  })

  it("query y mutation funcionan", async () => {
    const query = renderHook(() => useSecciones(), { wrapper: wrapper() })
    await waitFor(() => expect(query.result.current.isSuccess).toBe(true))
    query.unmount()

    const { result } = renderHook(() => useUpdateSeccionPublicado(), { wrapper: wrapper() })
    await act(async () => {
      await result.current.mutateAsync("x" as never)
    })
    expect(api.updateSeccionPublicado).toHaveBeenCalled()
  })
})
