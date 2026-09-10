import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const api = vi.hoisted(() => ({
  getDocentes: vi.fn(),
  getDocenteDetalle: vi.fn(),
  getPerfilesDisponibles: vi.fn(),
  createDocente: vi.fn(),
  updateDocente: vi.fn(),
  eliminarDocente: vi.fn(),
}))

vi.mock("../api/getDocentes", () => ({ getDocentes: api.getDocentes }))
vi.mock("../api/getDocenteDetalle", () => ({ getDocenteDetalle: api.getDocenteDetalle }))
vi.mock("../api/getPerfilesDisponibles", () => ({ getPerfilesDisponibles: api.getPerfilesDisponibles }))
vi.mock("../api/createDocente", () => ({ createDocente: api.createDocente }))
vi.mock("../api/updateDocente", () => ({ updateDocente: api.updateDocente }))
vi.mock("../api/eliminarDocente", () => ({ eliminarDocente: api.eliminarDocente }))
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

import { createQueryWrapper, createTestQueryClient } from "@/test/query"

import { useCreateDocente } from "./useCreateDocente"
import { useDocenteDetalle } from "./useDocenteDetalle"
import { useDocentes } from "./useDocentes"
import { useEliminarDocente } from "./useEliminarDocente"
import { usePerfilesDisponibles } from "./usePerfilesDisponibles"
import { useUpdateDocente } from "./useUpdateDocente"

function wrapper() {
  return createQueryWrapper(createTestQueryClient())
}

describe("docentes hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    for (const fn of Object.values(api)) fn.mockResolvedValue({ data: [], error: null })
  })

  it("las queries resuelven", async () => {
    const hooks: Array<() => { isSuccess: boolean }> = [
      () => useDocentes(),
      () => useDocenteDetalle("d1"),
      () => usePerfilesDisponibles(),
    ]

    for (const hook of hooks) {
      const { result, unmount } = renderHook(hook, { wrapper: wrapper() })
      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      unmount()
    }
  })

  it("las mutations llaman a la api alineada", async () => {
    const cases: Array<[() => { mutateAsync: (v: never) => Promise<unknown> }, ReturnType<typeof vi.fn>]> = [
      [useCreateDocente, api.createDocente],
      [useUpdateDocente, api.updateDocente],
      [useEliminarDocente, api.eliminarDocente],
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
