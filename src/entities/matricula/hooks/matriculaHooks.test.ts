import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const api = vi.hoisted(() => ({
  getInscripcionesPendientes: vi.fn(),
  aprobarMatricula: vi.fn(),
  rechazarMatricula: vi.fn(),
}))

vi.mock("../api/getInscripcionesPendientes", () => ({ getInscripcionesPendientes: api.getInscripcionesPendientes }))
vi.mock("../api/aprobarMatricula", () => ({ aprobarMatricula: api.aprobarMatricula }))
vi.mock("../api/rechazarMatricula", () => ({ rechazarMatricula: api.rechazarMatricula }))
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

import { createQueryWrapper, createTestQueryClient } from "@/test/query"

import { useAprobarMatricula } from "./useAprobarMatricula"
import { useInscripcionesPendientes } from "./useInscripcionesPendientes"
import { useRechazarMatricula } from "./useRechazarMatricula"

function wrapper() {
  return createQueryWrapper(createTestQueryClient())
}

describe("matricula hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    for (const fn of Object.values(api)) fn.mockResolvedValue({ data: [], error: null })
  })

  it("la query resuelve", async () => {
    const { result } = renderHook(() => useInscripcionesPendientes("c1"), { wrapper: wrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it("las mutations llaman a la api", async () => {
    for (const [hook, expected] of [
      [useAprobarMatricula, api.aprobarMatricula],
      [useRechazarMatricula, api.rechazarMatricula],
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
