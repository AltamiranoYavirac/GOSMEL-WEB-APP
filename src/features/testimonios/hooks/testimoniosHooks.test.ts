import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const api = vi.hoisted(() => ({
  getTestimonios: vi.fn(),
  updateTestimonioPublicado: vi.fn(),
}))

vi.mock("../api/getTestimonios", () => ({ getTestimonios: api.getTestimonios }))
vi.mock("../api/updateTestimonioPublicado", () => ({ updateTestimonioPublicado: api.updateTestimonioPublicado }))
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

import { createQueryWrapper, createTestQueryClient } from "@/test/query"

import { useTestimonios } from "./useTestimonios"
import { useUpdateTestimonioPublicado } from "./useUpdateTestimonioPublicado"

function wrapper() {
  return createQueryWrapper(createTestQueryClient())
}

describe("testimonios hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    for (const fn of Object.values(api)) fn.mockResolvedValue({ data: [], error: null })
  })

  it("query y mutation funcionan", async () => {
    const query = renderHook(() => useTestimonios(), { wrapper: wrapper() })
    await waitFor(() => expect(query.result.current.isSuccess).toBe(true))
    query.unmount()

    const { result } = renderHook(() => useUpdateTestimonioPublicado(), { wrapper: wrapper() })
    await act(async () => {
      await result.current.mutateAsync("x" as never)
    })
    expect(api.updateTestimonioPublicado).toHaveBeenCalled()
  })
})
