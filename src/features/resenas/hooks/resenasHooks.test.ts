import { renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const api = vi.hoisted(() => ({
  getResenas: vi.fn(),
  updateResenaPublicado: vi.fn(),
  eliminarResena: vi.fn(),
}))

vi.mock("../api/getResenas", () => ({ getResenas: api.getResenas }))
vi.mock("../api/updateResenaPublicado", () => ({
  updateResenaPublicado: api.updateResenaPublicado,
  eliminarResena: api.eliminarResena,
}))

import { createQueryWrapper, createTestQueryClient } from "@/test/query"

import { useResenas } from "./useResenas"

function wrapper() {
  return createQueryWrapper(createTestQueryClient())
}

describe("resenas hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    for (const fn of Object.values(api)) fn.mockResolvedValue({ data: [], error: null })
  })

  it("la query resuelve", async () => {
    const { result } = renderHook(() => useResenas(), { wrapper: wrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})
