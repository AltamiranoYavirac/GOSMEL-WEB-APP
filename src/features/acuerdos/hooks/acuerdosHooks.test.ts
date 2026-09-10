import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const api = vi.hoisted(() => ({
  getAcuerdos: vi.fn(),
  crearAcuerdo: vi.fn(),
  eliminarAcuerdo: vi.fn(),
  updateAcuerdo: vi.fn(),
}))

vi.mock("../api/getAcuerdos", () => ({ getAcuerdos: api.getAcuerdos }))
vi.mock("../api/crearAcuerdo", () => ({ crearAcuerdo: api.crearAcuerdo }))
vi.mock("../api/eliminarAcuerdo", () => ({ eliminarAcuerdo: api.eliminarAcuerdo }))
vi.mock("../api/updateAcuerdo", () => ({ updateAcuerdo: api.updateAcuerdo }))

import { createQueryWrapper, createTestQueryClient } from "@/test/query"

import { useAcuerdos } from "./useAcuerdos"
import { useCrearAcuerdo } from "./useCrearAcuerdo"
import { useEliminarAcuerdo } from "./useEliminarAcuerdo"
import { useUpdateAcuerdo } from "./useUpdateAcuerdo"

function wrapper() {
  return createQueryWrapper(createTestQueryClient())
}

describe("acuerdos hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    for (const fn of Object.values(api)) fn.mockResolvedValue({ data: [], error: null })
  })

  it("la query resuelve", async () => {
    const { result } = renderHook(() => useAcuerdos(), { wrapper: wrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it("las mutations llaman a la api", async () => {
    const cases: Array<[() => { mutateAsync: (v: never) => Promise<unknown> }, ReturnType<typeof vi.fn>]> = [
      [useCrearAcuerdo, api.crearAcuerdo],
      [useEliminarAcuerdo, api.eliminarAcuerdo],
      [useUpdateAcuerdo, api.updateAcuerdo],
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
