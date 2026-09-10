import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const api = vi.hoisted(() => ({
  getCursos: vi.fn(),
  getCursoById: vi.fn(),
  getCursoGuia: vi.fn(),
  getCursoHabilidades: vi.fn(),
  getCursoOptions: vi.fn(),
  crearCurso: vi.fn(),
  updateCurso: vi.fn(),
  eliminarCurso: vi.fn(),
  crearModulo: vi.fn(),
  updateModulo: vi.fn(),
  eliminarModulo: vi.fn(),
  crearLeccion: vi.fn(),
  updateLeccion: vi.fn(),
  eliminarLeccion: vi.fn(),
  crearHabilidad: vi.fn(),
  eliminarHabilidad: vi.fn(),
}))

vi.mock("../api/getCursos", () => ({ getCursos: api.getCursos }))
vi.mock("../api/getCursoById", () => ({ getCursoById: api.getCursoById }))
vi.mock("../api/getCursoGuia", () => ({ getCursoGuia: api.getCursoGuia }))
vi.mock("../api/getCursoHabilidades", () => ({
  getCursoHabilidades: api.getCursoHabilidades,
  crearHabilidad: api.crearHabilidad,
  eliminarHabilidad: api.eliminarHabilidad,
}))
vi.mock("../api/getCursoOptions", () => ({ getCursoOptions: api.getCursoOptions }))
vi.mock("../api/crearCurso", () => ({ crearCurso: api.crearCurso }))
vi.mock("../api/updateCurso", () => ({ updateCurso: api.updateCurso }))
vi.mock("../api/eliminarCurso", () => ({ eliminarCurso: api.eliminarCurso }))
vi.mock("../api/crearModulo", () => ({ crearModulo: api.crearModulo }))
vi.mock("../api/updateModulo", () => ({ updateModulo: api.updateModulo }))
vi.mock("../api/eliminarModulo", () => ({ eliminarModulo: api.eliminarModulo }))
vi.mock("../api/crearLeccion", () => ({ crearLeccion: api.crearLeccion }))
vi.mock("../api/updateLeccion", () => ({ updateLeccion: api.updateLeccion }))
vi.mock("../api/eliminarLeccion", () => ({ eliminarLeccion: api.eliminarLeccion }))
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

import { createQueryWrapper, createTestQueryClient } from "@/test/query"

import { useCrearCurso } from "./useCrearCurso"
import { useCrearHabilidad } from "./useCrearHabilidad"
import { useCrearLeccion } from "./useCrearLeccion"
import { useCrearModulo } from "./useCrearModulo"
import { useCurso } from "./useCurso"
import { useCursoGuia } from "./useCursoGuia"
import { useCursoHabilidades } from "./useCursoHabilidades"
import { useCursoOptions } from "./useCursoOptions"
import { useCursos } from "./useCursos"
import { useEliminarCurso } from "./useEliminarCurso"
import { useEliminarHabilidad } from "./useEliminarHabilidad"
import { useEliminarLeccion } from "./useEliminarLeccion"
import { useEliminarModulo } from "./useEliminarModulo"
import { useUpdateCurso } from "./useUpdateCurso"
import { useUpdateLeccion } from "./useUpdateLeccion"
import { useUpdateModulo } from "./useUpdateModulo"

const OK = { data: [], error: null }

function wrapper() {
  return createQueryWrapper(createTestQueryClient())
}

describe("cursos hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    for (const fn of Object.values(api)) fn.mockResolvedValue(OK)
  })

  it("las queries resuelven", async () => {
    const hooks: Array<() => { isSuccess: boolean }> = [
      () => useCursos(),
      () => useCurso("k1"),
      () => useCursoGuia("k1"),
      () => useCursoHabilidades("k1"),
      () => useCursoOptions(),
    ]

    for (const hook of hooks) {
      const { result, unmount } = renderHook(hook, { wrapper: wrapper() })
      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      unmount()
    }
  })

  it("las mutations llaman a la api alineada", async () => {
    const cases: Array<[() => { mutateAsync: (v: never) => Promise<unknown> }, ReturnType<typeof vi.fn>]> = [
      [useCrearCurso, api.crearCurso],
      [useUpdateCurso, api.updateCurso],
      [useEliminarCurso, api.eliminarCurso],
      [() => useCrearModulo("k1"), api.crearModulo],
      [() => useUpdateModulo("k1"), api.updateModulo],
      [() => useEliminarModulo("k1"), api.eliminarModulo],
      [() => useCrearLeccion("m1"), api.crearLeccion],
      [() => useUpdateLeccion("m1"), api.updateLeccion],
      [() => useEliminarLeccion("m1"), api.eliminarLeccion],
      [() => useCrearHabilidad("k1"), api.crearHabilidad],
      [() => useEliminarHabilidad("k1"), api.eliminarHabilidad],
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

  it("expone error en queries fallidas", async () => {
    api.getCursos.mockResolvedValue({ data: null, error: "boom" })

    const { result } = renderHook(() => useCursos(), { wrapper: wrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect((result.current.error as Error).message).toBe("boom")
  })

  it("propaga errores en mutations", async () => {
    for (const fn of Object.values(api)) fn.mockResolvedValue({ data: null, error: "boom" })

    const mutations: Array<() => { mutateAsync: (v: never) => Promise<unknown> }> = [
      useCrearCurso,
      useUpdateCurso,
      useEliminarCurso,
      () => useCrearModulo("k1"),
      () => useUpdateModulo("k1"),
      () => useEliminarModulo("k1"),
      () => useCrearLeccion("m1"),
      () => useUpdateLeccion("m1"),
      () => useEliminarLeccion("m1"),
      () => useCrearHabilidad("k1"),
      () => useEliminarHabilidad("k1"),
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
