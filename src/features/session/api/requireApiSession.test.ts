import { beforeEach, describe, expect, it, vi } from "vitest"

import type { ISessionUser } from "@/entities/user"

const { getServerSessionMock } = vi.hoisted(() => ({ getServerSessionMock: vi.fn() }))

vi.mock("./getServerSession", () => ({ getServerSession: getServerSessionMock }))

import { requireApiSession } from "./requireApiSession"
import type { TApiSessionResult } from "./requireApiSession.types"

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

async function expectFailure(result: TApiSessionResult, status: number, error: string) {
  expect(result.ok).toBe(false)
  if (result.ok) return

  expect(result.response.status).toBe(status)
  await expect(result.response.json()).resolves.toEqual({ data: null, error })
}

describe("requireApiSession", () => {
  beforeEach(() => {
    getServerSessionMock.mockReset()
  })

  it("responde 500 cuando la sesión falla", async () => {
    getServerSessionMock.mockResolvedValue({ kind: "error", data: null, error: "db caída" })

    await expectFailure(await requireApiSession(), 500, "db caída")
  })

  it("responde 401 si es anónimo", async () => {
    getServerSessionMock.mockResolvedValue({ kind: "anonymous", data: null, error: null })

    await expectFailure(await requireApiSession(["admin"]), 401, "No autenticado")
  })

  it("responde 403 si la cuenta está inactiva", async () => {
    getServerSessionMock.mockResolvedValue({
      kind: "authenticated",
      data: buildSession({ isActive: false }),
      error: null,
    })

    await expectFailure(await requireApiSession(), 403, "Cuenta inactiva")
  })

  it("responde 403 si el rol no está permitido", async () => {
    getServerSessionMock.mockResolvedValue({
      kind: "authenticated",
      data: buildSession({ roles: ["estudiante"] }),
      error: null,
    })

    await expectFailure(await requireApiSession(["admin"]), 403, "Sin permisos")
  })

  it("devuelve la sesión si el rol está permitido", async () => {
    const session = buildSession({ roles: ["docente", "admin"] })
    getServerSessionMock.mockResolvedValue({ kind: "authenticated", data: session, error: null })

    const result = await requireApiSession(["docente"])

    expect(result.ok).toBe(true)
    if (result.ok) expect(result.session).toEqual(session)
  })

  it("acepta cualquier sesión activa sin lista de roles", async () => {
    const session = buildSession({ roles: ["representante"] })
    getServerSessionMock.mockResolvedValue({ kind: "authenticated", data: session, error: null })

    const result = await requireApiSession()

    expect(result.ok).toBe(true)
  })
})
