import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const api = vi.hoisted(() => ({
  getAsignaciones: vi.fn(),
  reasignarCatedras: vi.fn(),
}))

vi.mock("../api/getAsignaciones", () => ({ getAsignaciones: api.getAsignaciones }))
vi.mock("../api/reasignarCatedras", () => ({ reasignarCatedras: api.reasignarCatedras }))
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

import { createQueryWrapper, createTestQueryClient } from "@/test/query"

import { useAsignaciones } from "./useAsignaciones"
import { useReasignarCatedras } from "./useReasignarCatedras"

function wrapper() {
  return createQueryWrapper(createTestQueryClient())
}

describe("asignaciones hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    api.getAsignaciones.mockResolvedValue({ data: { catedras: [], docentes: [] }, error: null })
    api.reasignarCatedras.mockResolvedValue({ data: { actualizadas: 1 }, error: null })
  })

  it("useAsignaciones resuelve con el shape esperado", async () => {
    const { result, unmount } = renderHook(() => useAsignaciones(), { wrapper: wrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual({ catedras: [], docentes: [] })
    unmount()
  })

  it("useReasignarCatedras llama a la api", async () => {
    const { result, unmount } = renderHook(() => useReasignarCatedras(), { wrapper: wrapper() })

    await act(async () => {
      await result.current.mutateAsync({ catedraIds: ["c1"], docenteId: "p1" })
    })

    expect(api.reasignarCatedras).toHaveBeenCalledWith({ catedraIds: ["c1"], docenteId: "p1" })
    unmount()
  })

  it("useReasignarCatedras propaga el error", async () => {
    api.reasignarCatedras.mockResolvedValue({ data: null, error: "no compatible" })

    const { result, unmount } = renderHook(() => useReasignarCatedras(), { wrapper: wrapper() })

    await act(async () => {
      await expect(result.current.mutateAsync({ catedraIds: ["c1"], docenteId: "p2" })).rejects.toThrow(
        "no compatible",
      )
    })
    unmount()
  })
})
