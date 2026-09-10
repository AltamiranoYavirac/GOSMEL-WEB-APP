import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const api = vi.hoisted(() => ({
  getCertificados: vi.fn(),
  emitirCertificado: vi.fn(),
  eliminarCertificado: vi.fn(),
  getInscripcionesParaCertificados: vi.fn(),
}))

vi.mock("../api/getCertificados", () => ({ getCertificados: api.getCertificados }))
vi.mock("../api/emitirCertificado", () => ({
  emitirCertificado: api.emitirCertificado,
  eliminarCertificado: api.eliminarCertificado,
  getInscripcionesParaCertificados: api.getInscripcionesParaCertificados,
}))

import { createQueryWrapper, createTestQueryClient } from "@/test/query"

import {
  useCertificados,
  useEliminarCertificado,
  useEmitirCertificado,
  useInscripcionesParaCertificados,
} from "./useCertificados"

function wrapper() {
  return createQueryWrapper(createTestQueryClient())
}

describe("certificados hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    for (const fn of Object.values(api)) fn.mockResolvedValue({ data: [], error: null })
  })

  it("las queries resuelven e invalidan en success", async () => {
    const hooks: Array<() => { isSuccess: boolean }> = [
      () => useCertificados(),
      () => useInscripcionesParaCertificados(),
    ]

    for (const hook of hooks) {
      const { result, unmount } = renderHook(hook, { wrapper: wrapper() })
      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      unmount()
    }
  })

  it("las mutations llaman a la api", async () => {
    const cases: Array<[() => { mutateAsync: (v: never) => Promise<unknown> }, ReturnType<typeof vi.fn>]> = [
      [useEmitirCertificado, api.emitirCertificado],
      [useEliminarCertificado, api.eliminarCertificado],
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
