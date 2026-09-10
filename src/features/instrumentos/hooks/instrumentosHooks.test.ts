import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const api = vi.hoisted(() => ({
  getInstrumentos: vi.fn(),
  eliminarInstrumento: vi.fn(),
  crearInstrumento: vi.fn(),
  updateInstrumento: vi.fn(),
  eliminarInstrumentoDirecto: vi.fn(),
  getTiposInstrumento: vi.fn(),
  crearTipoInstrumento: vi.fn(),
  eliminarTipoInstrumento: vi.fn(),
}))

vi.mock("../api/getInstrumentos", () => ({ getInstrumentos: api.getInstrumentos }))
vi.mock("../api/eliminarInstrumento", () => ({ eliminarInstrumento: api.eliminarInstrumento }))
vi.mock("../api/crearInstrumento", () => ({
  crearInstrumento: api.crearInstrumento,
  updateInstrumento: api.updateInstrumento,
  eliminarInstrumento: api.eliminarInstrumentoDirecto,
}))
vi.mock("../api/getTiposInstrumento", () => ({
  getTiposInstrumento: api.getTiposInstrumento,
  crearTipoInstrumento: api.crearTipoInstrumento,
  eliminarTipoInstrumento: api.eliminarTipoInstrumento,
}))
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

import { createQueryWrapper, createTestQueryClient } from "@/test/query"

import { useCrearInstrumento, useEliminarInstrumento, useUpdateInstrumento } from "./useCrearInstrumento"
import { useInstrumentos } from "./useInstrumentos"
import { useCrearTipoInstrumento, useEliminarTipoInstrumento, useTiposInstrumento } from "./useTiposInstrumento"

function wrapper() {
  return createQueryWrapper(createTestQueryClient())
}

describe("instrumentos hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    for (const fn of Object.values(api)) fn.mockResolvedValue({ data: [], error: null })
  })

  it("las queries resuelven", async () => {
    const hooks = [() => useInstrumentos(), () => useTiposInstrumento()]

    for (const hook of hooks) {
      const { result, unmount } = renderHook(hook, { wrapper: wrapper() })
      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      unmount()
    }
  })

  it("las mutations llaman a la api alineada", async () => {
    const cases: Array<[() => { mutateAsync: (v: never) => Promise<unknown> }, ReturnType<typeof vi.fn>]> = [
      [useCrearInstrumento, api.crearInstrumento],
      [useUpdateInstrumento, api.updateInstrumento],
      [useEliminarInstrumento, api.eliminarInstrumentoDirecto],
      [useCrearTipoInstrumento, api.crearTipoInstrumento],
      [useEliminarTipoInstrumento, api.eliminarTipoInstrumento],
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

    const query = renderHook(() => useInstrumentos(), { wrapper: wrapper() })
    await waitFor(() => expect(query.result.current.isError).toBe(true))
    query.unmount()

    const mutations: Array<() => { mutateAsync: (v: never) => Promise<unknown> }> = [
      useCrearInstrumento,
      useUpdateInstrumento,
      useEliminarInstrumento,
      useCrearTipoInstrumento,
      useEliminarTipoInstrumento,
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
