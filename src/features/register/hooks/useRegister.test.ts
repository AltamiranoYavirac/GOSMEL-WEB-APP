import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const api = vi.hoisted(() => ({
  signUp: vi.fn(),
  replace: vi.fn(),
}))

vi.mock("../api", () => ({ signUp: api.signUp }))
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: api.replace }),
}))

import { createQueryWrapper, createTestQueryClient } from "@/test/query"

import { useRegister } from "./useRegister"

function wrapper() {
  return createQueryWrapper(createTestQueryClient())
}

describe("useRegister", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("redirige a login tras registrar", async () => {
    api.signUp.mockResolvedValue({ data: { id: "u1" }, error: null })

    const { result } = renderHook(() => useRegister(), { wrapper: wrapper() })

    await act(async () => {
      await result.current.mutateAsync({ email: "a@x.com", password: "Secret123!", nombre: "Ada", apellido: "Lovelace" } as never)
    })

    expect(api.replace).toHaveBeenCalledWith("/login")
  })

  it("traduce el error de registro", async () => {
    api.signUp.mockResolvedValue({ data: null, error: "user_already_exists" })

    const { result } = renderHook(() => useRegister(), { wrapper: wrapper() })

    await act(async () => {
      await expect(result.current.mutateAsync({} as never)).rejects.toThrow()
    })
  })
})
