import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const api = vi.hoisted(() => ({
  getSession: vi.fn(),
  signOut: vi.fn(),
  subscribeToAuthState: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
}))

vi.mock("../api/getSession", () => ({ getSession: api.getSession }))
vi.mock("../api/signOut", () => ({ signOut: api.signOut }))
vi.mock("../api/subscribeToAuthState", () => ({ subscribeToAuthState: api.subscribeToAuthState }))
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: api.replace, refresh: api.refresh }),
}))

import { createQueryWrapper, createTestQueryClient } from "@/test/query"

import { useLogout } from "./useLogout"
import { useSession } from "./useSession"
import { useSessionRefresh } from "./useSessionRefresh"

function wrapper() {
  return createQueryWrapper(createTestQueryClient())
}

describe("session hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    api.getSession.mockResolvedValue({ data: null, error: null })
    api.signOut.mockResolvedValue({ error: null })
    api.subscribeToAuthState.mockReturnValue(() => {})
  })

  it("useSession resuelve y propaga error", async () => {
    const { result, unmount } = renderHook(() => useSession(), { wrapper: wrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    unmount()

    api.getSession.mockResolvedValue({ data: null, error: "boom" })
    const failed = renderHook(() => useSession(), { wrapper: wrapper() })
    await waitFor(() => expect(failed.result.current.isError).toBe(true))
  })

  it("useLogout cierra sesión y redirige", async () => {
    const { result } = renderHook(() => useLogout(), { wrapper: wrapper() })

    await act(async () => {
      await result.current.mutateAsync(undefined as never)
    })

    expect(api.signOut).toHaveBeenCalled()
    expect(api.replace).toHaveBeenCalledWith("/login")
    expect(api.refresh).toHaveBeenCalled()
  })

  it("useSessionRefresh se suscribe al estado de auth", () => {
    const { unmount } = renderHook(() => useSessionRefresh(), { wrapper: wrapper() })

    expect(api.subscribeToAuthState).toHaveBeenCalled()

    unmount()
  })
})
