import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const api = vi.hoisted(() => ({
  getProgramas: vi.fn(),
  getProgramaDetalle: vi.fn(),
  getProgramaOptions: vi.fn(),
  crearPrograma: vi.fn(),
  updatePrograma: vi.fn(),
  eliminarPrograma: vi.fn(),
  updateProgramaPublicado: vi.fn(),
  asociarCursoPrograma: vi.fn(),
  desasociarCursoPrograma: vi.fn(),
}))

vi.mock("../api/getProgramas", () => ({ getProgramas: api.getProgramas }))
vi.mock("../api/getProgramaDetalle", () => ({
  getProgramaDetalle: api.getProgramaDetalle,
  asociarCursoPrograma: api.asociarCursoPrograma,
  desasociarCursoPrograma: api.desasociarCursoPrograma,
}))
vi.mock("../api/getProgramaOptions", () => ({ getProgramaOptions: api.getProgramaOptions }))
vi.mock("../api/crearPrograma", () => ({ crearPrograma: api.crearPrograma }))
vi.mock("../api/updatePrograma", () => ({ updatePrograma: api.updatePrograma }))
vi.mock("../api/eliminarPrograma", () => ({ eliminarPrograma: api.eliminarPrograma }))
vi.mock("../api/updateProgramaPublicado", () => ({ updateProgramaPublicado: api.updateProgramaPublicado }))
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

import { createQueryWrapper, createTestQueryClient } from "@/test/query"

import { useAsociarCursoPrograma } from "./useAsociarCursoPrograma"
import { useCrearPrograma } from "./useCrearPrograma"
import { useDesasociarCursoPrograma } from "./useDesasociarCursoPrograma"
import { useEliminarPrograma } from "./useEliminarPrograma"
import { useProgramaDetalle } from "./useProgramaDetalle"
import { useProgramaOptions } from "./useProgramaOptions"
import { useProgramas } from "./useProgramas"
import { useUpdatePrograma } from "./useUpdatePrograma"
import { useUpdateProgramaPublicado } from "./useUpdateProgramaPublicado"

function wrapper() {
  return createQueryWrapper(createTestQueryClient())
}

describe("programas hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    for (const fn of Object.values(api)) fn.mockResolvedValue({ data: [], error: null })
  })

  it("las queries resuelven", async () => {
    const hooks: Array<() => { isSuccess: boolean }> = [
      () => useProgramas(),
      () => useProgramaDetalle("pg1"),
      () => useProgramaOptions(),
    ]

    for (const hook of hooks) {
      const { result, unmount } = renderHook(hook, { wrapper: wrapper() })
      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      unmount()
    }
  })

  it("las mutations llaman a la api alineada", async () => {
    const cases: Array<[() => { mutateAsync: (v: never) => Promise<unknown> }, ReturnType<typeof vi.fn>]> = [
      [useCrearPrograma, api.crearPrograma],
      [useUpdatePrograma, api.updatePrograma],
      [useEliminarPrograma, api.eliminarPrograma],
      [useUpdateProgramaPublicado, api.updateProgramaPublicado],
      [() => useAsociarCursoPrograma("pg1"), api.asociarCursoPrograma],
      [() => useDesasociarCursoPrograma("pg1"), api.desasociarCursoPrograma],
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

    const query = renderHook(() => useProgramas(), { wrapper: wrapper() })
    await waitFor(() => expect(query.result.current.isError).toBe(true))
    query.unmount()

    const mutations: Array<() => { mutateAsync: (v: never) => Promise<unknown> }> = [
      useCrearPrograma,
      useUpdatePrograma,
      useEliminarPrograma,
      useUpdateProgramaPublicado,
      () => useAsociarCursoPrograma("pg1"),
      () => useDesasociarCursoPrograma("pg1"),
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
