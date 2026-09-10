import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const api = vi.hoisted(() => ({
  getCatedraEstudiantes: vi.fn(),
  getCatedraOptions: vi.fn(),
  crearCatedra: vi.fn(),
  updateCatedra: vi.fn(),
  eliminarCatedra: vi.fn(),
  eliminarInscripcionCatedra: vi.fn(),
  generarSesionesCatedra: vi.fn(),
}))

vi.mock("../api/getCatedraEstudiantes", () => ({ getCatedraEstudiantes: api.getCatedraEstudiantes }))
vi.mock("../api/getCatedraOptions", () => ({ getCatedraOptions: api.getCatedraOptions }))
vi.mock("../api/crearCatedra", () => ({ crearCatedra: api.crearCatedra }))
vi.mock("../api/updateCatedra", () => ({ updateCatedra: api.updateCatedra }))
vi.mock("../api/eliminarCatedra", () => ({ eliminarCatedra: api.eliminarCatedra }))
vi.mock("../api/eliminarInscripcionCatedra", () => ({ eliminarInscripcionCatedra: api.eliminarInscripcionCatedra }))
vi.mock("../api/generarSesionesCatedra", () => ({ generarSesionesCatedra: api.generarSesionesCatedra }))
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

import { createQueryWrapper, createTestQueryClient } from "@/test/query"

import { useCatedraEstudiantes } from "./useCatedraEstudiantes"
import { useCatedraOptions } from "./useCatedraOptions"
import { useCrearCatedra } from "./useCrearCatedra"
import { useEliminarCatedra } from "./useEliminarCatedra"
import { useEliminarInscripcionCatedra } from "./useEliminarInscripcionCatedra"
import { useGenerarSesionesCatedra } from "./useGenerarSesionesCatedra"
import { useUpdateCatedra } from "./useUpdateCatedra"

function wrapper() {
  return createQueryWrapper(createTestQueryClient())
}

describe("catedras hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    for (const fn of Object.values(api)) fn.mockResolvedValue({ data: [], error: null })
  })

  it("las queries resuelven", async () => {
    const hooks: Array<() => { isSuccess: boolean }> = [() => useCatedraEstudiantes("c1"), () => useCatedraOptions()]

    for (const hook of hooks) {
      const { result, unmount } = renderHook(hook, { wrapper: wrapper() })
      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      unmount()
    }
  })

  it("las mutations llaman a la api alineada", async () => {
    const cases: Array<[() => { mutateAsync: (v: never) => Promise<unknown> }, ReturnType<typeof vi.fn>]> = [
      [useCrearCatedra, api.crearCatedra],
      [useUpdateCatedra, api.updateCatedra],
      [useEliminarCatedra, api.eliminarCatedra],
      [() => useEliminarInscripcionCatedra("c1"), api.eliminarInscripcionCatedra],
      [useGenerarSesionesCatedra, api.generarSesionesCatedra],
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

  it("propaga errores en queries y mutations", async () => {
    for (const fn of Object.values(api)) fn.mockResolvedValue({ data: null, error: "boom" })

    const query = renderHook(() => useCatedraEstudiantes("c1"), { wrapper: wrapper() })
    await waitFor(() => expect(query.result.current.isError).toBe(true))
    query.unmount()

    const mutations: Array<() => { mutateAsync: (v: never) => Promise<unknown> }> = [
      useCrearCatedra,
      useUpdateCatedra,
      useEliminarCatedra,
      () => useEliminarInscripcionCatedra("c1"),
      useGenerarSesionesCatedra,
    ]

    for (const hook of mutations) {
      const { result, unmount } = renderHook(hook, { wrapper: wrapper() })
      await act(async () => {
        await expect(result.current.mutateAsync("x" as never)).rejects.toThrow("boom")
      })
      unmount()
    }
  })
})
