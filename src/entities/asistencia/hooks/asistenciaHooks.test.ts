import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const api = vi.hoisted(() => ({
  getAsistenciasSesion: vi.fn(),
  guardarAsistenciasSesion: vi.fn(),
}))

vi.mock("../api/getAsistenciasSesion", () => ({ getAsistenciasSesion: api.getAsistenciasSesion }))
vi.mock("../api/guardarAsistenciasSesion", () => ({ guardarAsistenciasSesion: api.guardarAsistenciasSesion }))

import { createQueryWrapper, createTestQueryClient } from "@/test/query"

import { useAsistenciasSesion } from "./useAsistenciasSesion"
import { useGuardarAsistenciasSesion } from "./useGuardarAsistenciasSesion"

function wrapper() {
  return createQueryWrapper(createTestQueryClient())
}

describe("asistencia hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    for (const fn of Object.values(api)) fn.mockResolvedValue({ data: [], error: null })
  })

  it("la query resuelve y queda idle sin sesión", async () => {
    const { result, unmount } = renderHook(() => useAsistenciasSesion("s1"), { wrapper: wrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    unmount()

    const disabled = renderHook(() => useAsistenciasSesion(""), { wrapper: wrapper() })
    expect(disabled.result.current.fetchStatus).toBe("idle")
    disabled.unmount()
  })

  it("propaga el error de la query", async () => {
    api.getAsistenciasSesion.mockResolvedValue({ data: null, error: "boom" })

    const { result, unmount } = renderHook(() => useAsistenciasSesion("s1"), { wrapper: wrapper() })
    await waitFor(() => expect(result.current.isError).toBe(true))
    unmount()
  })

  it("guardar llama a la api y propaga errores", async () => {
    const { result, unmount } = renderHook(() => useGuardarAsistenciasSesion("s1"), { wrapper: wrapper() })
    await act(async () => {
      await result.current.mutateAsync([])
    })
    expect(api.guardarAsistenciasSesion).toHaveBeenCalled()
    unmount()

    api.guardarAsistenciasSesion.mockResolvedValue({ error: "boom" })

    const failing = renderHook(() => useGuardarAsistenciasSesion("s1"), { wrapper: wrapper() })
    await act(async () => {
      await expect(failing.result.current.mutateAsync([])).rejects.toThrow("boom")
    })
    failing.unmount()
  })
})
