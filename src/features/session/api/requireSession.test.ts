import { beforeEach, describe, expect, it, vi } from "vitest"

import type { ISessionUser } from "@/entities/user"

const { getServerSessionMock, redirectMock } = vi.hoisted(() => ({
  getServerSessionMock: vi.fn(),
  redirectMock: vi.fn((url: string): never => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  }),
}))

vi.mock("./getServerSession", () => ({ getServerSession: getServerSessionMock }))
vi.mock("next/navigation", () => ({ redirect: redirectMock }))

import { requireSession } from "./requireSession"

function buildSession(overrides: Partial<ISessionUser> = {}): ISessionUser {
  return {
    id: "u1",
    email: "ada@x.com",
    displayName: "Ada Lovelace",
    avatarPublicId: null,
    roles: ["admin"],
    homeRoute: "/dashboard/admin",
    isActive: true,
    ...overrides,
  }
}

describe("requireSession", () => {
  beforeEach(() => {
    getServerSessionMock.mockReset()
    redirectMock.mockClear()
  })

  it("lanza el error cuando la sesión falla", async () => {
    getServerSessionMock.mockResolvedValue({ kind: "error", data: null, error: "db caída" })

    await expect(requireSession()).rejects.toThrow("db caída")
  })

  it("redirige a /login si es anónimo", async () => {
    getServerSessionMock.mockResolvedValue({ kind: "anonymous", data: null, error: null })

    await expect(requireSession()).rejects.toThrow("NEXT_REDIRECT:/login")
  })

  it("redirige a signout si la cuenta está inactiva", async () => {
    getServerSessionMock.mockResolvedValue({
      kind: "authenticated",
      data: buildSession({ isActive: false }),
      error: null,
    })

    await expect(requireSession()).rejects.toThrow("NEXT_REDIRECT:/auth/signout?reason=inactive")
  })

  it("redirige a la home del rol si no está permitido", async () => {
    getServerSessionMock.mockResolvedValue({
      kind: "authenticated",
      data: buildSession({ roles: ["estudiante"], homeRoute: "/dashboard/student" }),
      error: null,
    })

    await expect(requireSession(["admin"])).rejects.toThrow("NEXT_REDIRECT:/dashboard/student")
  })

  it("devuelve la sesión si el rol está permitido", async () => {
    const session = buildSession({ roles: ["docente", "admin"] })
    getServerSessionMock.mockResolvedValue({ kind: "authenticated", data: session, error: null })

    await expect(requireSession(["admin"])).resolves.toEqual(session)
    expect(redirectMock).not.toHaveBeenCalled()
  })

  it("devuelve la sesión sin lista de roles", async () => {
    const session = buildSession({ isActive: true })
    getServerSessionMock.mockResolvedValue({ kind: "authenticated", data: session, error: null })

    await expect(requireSession()).resolves.toEqual(session)
  })
})
