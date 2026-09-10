import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { beforeEach, describe, expect, it, vi } from "vitest"

const { updateSessionMock } = vi.hoisted(() => ({ updateSessionMock: vi.fn() }))

vi.mock("@/shared/api/supabase/proxy", () => ({ updateSession: updateSessionMock }))

import { proxy } from "./proxy"

function buildRequest(pathname: string, search = ""): NextRequest {
  const url = `https://gosmel.test${pathname}${search}`
  return {
    url,
    nextUrl: {
      pathname,
      search,
      searchParams: new URLSearchParams(search),
    },
  } as unknown as NextRequest
}

describe("proxy", () => {
  beforeEach(() => {
    updateSessionMock.mockReset()
  })

  it("redirige a /login con next cuando entra anónimo a /dashboard", async () => {
    updateSessionMock.mockResolvedValue({ response: NextResponse.next(), isAuthenticated: false })

    const result = await proxy(buildRequest("/dashboard/admin/usuarios", "?page=2"))

    expect(result.status).toBe(307)
    const location = new URL(result.headers.get("location")!)
    expect(location.pathname).toBe("/login")
    expect(location.searchParams.get("next")).toBe("/dashboard/admin/usuarios?page=2")
  })

  it("redirige a /dashboard cuando un autenticado visita /login", async () => {
    updateSessionMock.mockResolvedValue({ response: NextResponse.next(), isAuthenticated: true })

    const result = await proxy(buildRequest("/login"))

    expect(result.status).toBe(307)
    expect(new URL(result.headers.get("location")!).pathname).toBe("/dashboard")
  })

  it("deja pasar a un autenticado hacia /dashboard", async () => {
    const response = NextResponse.next()
    updateSessionMock.mockResolvedValue({ response, isAuthenticated: true })

    const result = await proxy(buildRequest("/dashboard"))

    expect(result).toBe(response)
  })

  it("deja pasar rutas públicas sin sesión", async () => {
    const response = NextResponse.next()
    updateSessionMock.mockResolvedValue({ response, isAuthenticated: false })

    const result = await proxy(buildRequest("/cursos"))

    expect(result).toBe(response)
  })
})
