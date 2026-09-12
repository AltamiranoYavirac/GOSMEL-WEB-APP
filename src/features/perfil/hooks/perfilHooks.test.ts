import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const api = vi.hoisted(() => ({
  eliminarAvatar: vi.fn(),
  refresh: vi.fn(),
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
}))

vi.mock("../api/eliminarAvatar", () => ({ eliminarAvatar: api.eliminarAvatar }))
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: api.refresh }),
}))
vi.mock("sonner", () => ({ toast: { success: api.toastSuccess, error: api.toastError } }))

import { sessionQueryKeys } from "@/entities/user"
import { createQueryWrapper, createTestQueryClient } from "@/test/query"

import { useEliminarAvatar } from "./useEliminarAvatar"

describe("perfil hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    api.eliminarAvatar.mockResolvedValue({ data: { eliminado: true }, error: null })
  })

  it("useEliminarAvatar llama a la api, invalida la sesión y refresca el router", async () => {
    const client = createTestQueryClient()
    const invalidateSpy = vi.spyOn(client, "invalidateQueries")

    const { result } = renderHook(() => useEliminarAvatar(), {
      wrapper: createQueryWrapper(client),
    })

    await act(async () => {
      await result.current.mutateAsync()
    })

    expect(api.eliminarAvatar).toHaveBeenCalled()
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: sessionQueryKeys.all })
    expect(api.refresh).toHaveBeenCalled()
    expect(api.toastSuccess).toHaveBeenCalledWith("Foto de perfil eliminada")
  })

  it("useEliminarAvatar propaga el error de la api", async () => {
    api.eliminarAvatar.mockResolvedValue({ data: null, error: "boom" })

    const { result } = renderHook(() => useEliminarAvatar(), {
      wrapper: createQueryWrapper(createTestQueryClient()),
    })

    await act(async () => {
      await expect(result.current.mutateAsync()).rejects.toThrow("boom")
    })

    expect(api.toastError).toHaveBeenCalledWith("boom")
  })
})
