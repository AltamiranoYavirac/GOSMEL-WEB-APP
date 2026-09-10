import { renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const api = vi.hoisted(() => ({
  getSiteConfig: vi.fn(),
}))

vi.mock("../api/getSiteConfig", () => ({ getSiteConfig: api.getSiteConfig }))

import { createQueryWrapper, createTestQueryClient } from "@/test/query"

import { useSiteConfig } from "./useSiteConfig"

function wrapper() {
  return createQueryWrapper(createTestQueryClient())
}

describe("useSiteConfig", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("resuelve la configuración", async () => {
    api.getSiteConfig.mockResolvedValue({ data: { nombre: "GOSMEL" }, error: null })

    const { result } = renderHook(() => useSiteConfig(), { wrapper: wrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual({ nombre: "GOSMEL" })
  })
})
