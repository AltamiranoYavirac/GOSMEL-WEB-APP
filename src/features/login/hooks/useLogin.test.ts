import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const api = vi.hoisted(() => ({
  signInWithPassword: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
}))

vi.mock("../api/signInWithPassword", () => ({ signInWithPassword: api.signInWithPassword }))
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: api.replace, refresh: api.refresh }),
}))

import { createQueryWrapper, createTestQueryClient } from "@/test/query"

import { useLogin } from "./useLogin"

function wrapper() {
  return createQueryWrapper(createTestQueryClient())
}

describe("useLogin", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("redirige según el rol al iniciar sesión", async () => {
    api.signInWithPassword.mockResolvedValue({ data: { roles: ["docente"] }, error: null })

    const { result } = renderHook(() => useLogin(), { wrapper: wrapper() })

    await act(async () => {
      await result.current.mutateAsync({ email: "a@x.com", password: "secret" })
    })

    expect(api.replace).toHaveBeenCalledWith("/dashboard/teacher")
    expect(api.refresh).toHaveBeenCalled()
  })

  it("traduce errores de credenciales", async () => {
    api.signInWithPassword.mockResolvedValue({ data: null, error: "invalid_credentials" })

    const { result } = renderHook(() => useLogin("/dashboard/admin"), { wrapper: wrapper() })

    await act(async () => {
      await expect(result.current.mutateAsync({ email: "a@x.com", password: "bad" })).rejects.toThrow(
        "Correo o contraseña incorrectos.",
      )
    })
  })
})
