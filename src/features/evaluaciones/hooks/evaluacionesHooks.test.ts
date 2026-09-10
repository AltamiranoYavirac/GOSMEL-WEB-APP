import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const api = vi.hoisted(() => ({
  getEvaluaciones: vi.fn(),
  getCalificacionesEvaluacion: vi.fn(),
  getCatedrasOptions: vi.fn(),
  crearEvaluacion: vi.fn(),
  eliminarEvaluacion: vi.fn(),
  guardarCalificaciones: vi.fn(),
}))

vi.mock("../api/getEvaluaciones", () => ({ getEvaluaciones: api.getEvaluaciones }))
vi.mock("../api/getCalificacionesEvaluacion", () => ({ getCalificacionesEvaluacion: api.getCalificacionesEvaluacion }))
vi.mock("../api/getCatedrasOptions", () => ({ getCatedrasOptions: api.getCatedrasOptions }))
vi.mock("../api/crearEvaluacion", () => ({ crearEvaluacion: api.crearEvaluacion }))
vi.mock("../api/eliminarEvaluacion", () => ({ eliminarEvaluacion: api.eliminarEvaluacion }))
vi.mock("../api/guardarCalificaciones", () => ({ guardarCalificaciones: api.guardarCalificaciones }))

import { createQueryWrapper, createTestQueryClient } from "@/test/query"

import { useCalificacionesEvaluacion } from "./useCalificacionesEvaluacion"
import { useCatedrasOptions } from "./useCatedrasOptions"
import { useCrearEvaluacion } from "./useCrearEvaluacion"
import { useEliminarEvaluacion } from "./useEliminarEvaluacion"
import { useEvaluaciones } from "./useEvaluaciones"
import { useGuardarCalificaciones } from "./useGuardarCalificaciones"

function wrapper() {
  return createQueryWrapper(createTestQueryClient())
}

describe("evaluaciones hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    for (const fn of Object.values(api)) fn.mockResolvedValue({ data: [], error: null })
  })

  it("las queries resuelven", async () => {
    const hooks: Array<() => { isSuccess: boolean }> = [
      () => useEvaluaciones(),
      () => useCalificacionesEvaluacion("ev1"),
      () => useCatedrasOptions(),
    ]

    for (const hook of hooks) {
      const { result, unmount } = renderHook(hook, { wrapper: wrapper() })
      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      unmount()
    }
  })

  it("las mutations llaman a la api alineada", async () => {
    const cases: Array<[() => { mutateAsync: (v: never) => Promise<unknown> }, ReturnType<typeof vi.fn>]> = [
      [useCrearEvaluacion, api.crearEvaluacion],
      [useEliminarEvaluacion, api.eliminarEvaluacion],
      [() => useGuardarCalificaciones("ev1"), api.guardarCalificaciones],
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

    const query = renderHook(() => useEvaluaciones(), { wrapper: wrapper() })
    await waitFor(() => expect(query.result.current.isError).toBe(true))
    query.unmount()

    const mutations: Array<() => { mutateAsync: (v: never) => Promise<unknown> }> = [
      useCrearEvaluacion,
      useEliminarEvaluacion,
      () => useGuardarCalificaciones("ev1"),
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
