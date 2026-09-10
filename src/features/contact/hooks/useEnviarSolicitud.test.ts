import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const api = vi.hoisted(() => ({
  enviarSolicitud: vi.fn(),
}))

vi.mock("../api/enviarSolicitud", () => ({ enviarSolicitud: api.enviarSolicitud }))
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

import { createQueryWrapper, createTestQueryClient } from "@/test/query"

import { useEnviarSolicitud } from "./useEnviarSolicitud"

function wrapper() {
  return createQueryWrapper(createTestQueryClient())
}

describe("useEnviarSolicitud", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    api.enviarSolicitud.mockResolvedValue({ data: { id: "s1" }, error: null })
  })

  it("envía la solicitud", async () => {
    const { result } = renderHook(() => useEnviarSolicitud(), { wrapper: wrapper() })

    await act(async () => {
      await result.current.mutateAsync("x" as never)
    })

    expect(api.enviarSolicitud).toHaveBeenCalled()
  })
})
