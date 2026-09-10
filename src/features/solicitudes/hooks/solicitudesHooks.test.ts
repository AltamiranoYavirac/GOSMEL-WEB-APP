import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const api = vi.hoisted(() => ({
  getSolicitudes: vi.fn(),
  updateSolicitudEstado: vi.fn(),
  crearMatricula: vi.fn(),
  getCatedrasParaMatricula: vi.fn(),
}))

vi.mock("../api/getSolicitudes", () => ({ getSolicitudes: api.getSolicitudes }))
vi.mock("../api/updateSolicitudEstado", () => ({ updateSolicitudEstado: api.updateSolicitudEstado }))
vi.mock("../api/crearMatricula", () => ({ crearMatricula: api.crearMatricula }))
vi.mock("../api/getCatedrasParaMatricula", () => ({ getCatedrasParaMatricula: api.getCatedrasParaMatricula }))

import { createQueryWrapper, createTestQueryClient } from "@/test/query"

import { useCatedrasParaMatricula } from "./useCatedrasParaMatricula"
import { useCrearMatricula } from "./useCrearMatricula"
import { useSolicitudes } from "./useSolicitudes"
import { useUpdateSolicitudEstado } from "./useUpdateSolicitudEstado"

function wrapper() {
  return createQueryWrapper(createTestQueryClient())
}

describe("solicitudes hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    for (const fn of Object.values(api)) fn.mockResolvedValue({ data: [], error: null })
  })

  it("las queries resuelven", async () => {
    const hooks: Array<() => { isSuccess: boolean }> = [() => useSolicitudes(), () => useCatedrasParaMatricula()]

    for (const hook of hooks) {
      const { result, unmount } = renderHook(hook, { wrapper: wrapper() })
      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      unmount()
    }
  })

  it("las mutations llaman a la api", async () => {
    const cases: Array<[() => { mutateAsync: (v: never) => Promise<unknown> }, ReturnType<typeof vi.fn>]> = [
      [useUpdateSolicitudEstado, api.updateSolicitudEstado],
      [useCrearMatricula, api.crearMatricula],
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
