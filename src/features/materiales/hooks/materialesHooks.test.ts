import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const api = vi.hoisted(() => ({
  getMateriales: vi.fn(),
  getMaterialOptions: vi.fn(),
  crearMaterial: vi.fn(),
  eliminarMaterial: vi.fn(),
}))

vi.mock("../api/getMateriales", () => ({ getMateriales: api.getMateriales }))
vi.mock("../api/getMaterialOptions", () => ({ getMaterialOptions: api.getMaterialOptions }))
vi.mock("../api/crearMaterial", () => ({ crearMaterial: api.crearMaterial }))
vi.mock("../api/eliminarMaterial", () => ({ eliminarMaterial: api.eliminarMaterial }))

import { createQueryWrapper, createTestQueryClient } from "@/test/query"

import { useCrearMaterial } from "./useCrearMaterial"
import { useEliminarMaterial } from "./useEliminarMaterial"
import { useMateriales } from "./useMateriales"
import { useMaterialOptions } from "./useMaterialOptions"

function wrapper() {
  return createQueryWrapper(createTestQueryClient())
}

describe("materiales hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    for (const fn of Object.values(api)) fn.mockResolvedValue({ data: [], error: null })
  })

  it("las queries resuelven", async () => {
    const hooks: Array<() => { isSuccess: boolean }> = [() => useMateriales(), () => useMaterialOptions()]

    for (const hook of hooks) {
      const { result, unmount } = renderHook(hook, { wrapper: wrapper() })
      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      unmount()
    }
  })

  it("las mutations llaman a la api", async () => {
    for (const [hook, expected] of [
      [useCrearMaterial, api.crearMaterial],
      [useEliminarMaterial, api.eliminarMaterial],
    ] as Array<[() => { mutateAsync: (v: never) => Promise<unknown> }, ReturnType<typeof vi.fn>]>) {
      const { result, unmount } = renderHook(hook, { wrapper: wrapper() })
      await act(async () => {
        await result.current.mutateAsync("x" as never)
      })
      expect(expected).toHaveBeenCalled()
      unmount()
    }
  })
})
