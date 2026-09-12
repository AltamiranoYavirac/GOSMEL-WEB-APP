import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const api = vi.hoisted(() => ({
  getSolicitudes: vi.fn(),
  updateSolicitudEstado: vi.fn(),
}))

vi.mock("../api/getSolicitudes", () => ({ getSolicitudes: api.getSolicitudes }))
vi.mock("../api/updateSolicitudEstado", () => ({ updateSolicitudEstado: api.updateSolicitudEstado }))

import { createQueryWrapper, createTestQueryClient } from "@/test/query"

import { useSolicitudes } from "./useSolicitudes"
import { useUpdateSolicitudEstado } from "./useUpdateSolicitudEstado"

function wrapper() {
  return createQueryWrapper(createTestQueryClient())
}

describe("solicitudes hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    for (const fn of Object.values(api)) fn.mockResolvedValue({ data: [], error: null })
  })

  it("la query resuelve", async () => {
    const { result, unmount } = renderHook(() => useSolicitudes(), { wrapper: wrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    unmount()
  })

  it("la mutation llama a la api", async () => {
    const { result, unmount } = renderHook(() => useUpdateSolicitudEstado(), { wrapper: wrapper() })
    await act(async () => {
      await result.current.mutateAsync("x" as never)
    })
    expect(api.updateSolicitudEstado).toHaveBeenCalled()
    unmount()
  })
})
