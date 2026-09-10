import { beforeEach, describe, expect, it, vi } from "vitest"

const { createSupabaseServerClientMock } = vi.hoisted(() => ({
  createSupabaseServerClientMock: vi.fn(),
}))

vi.mock("@/shared/api/supabase/server", () => ({
  createSupabaseServerClient: createSupabaseServerClientMock,
}))

import { createFakeSupabase } from "@/test/supabase"
import { getServerSession } from "./getServerSession"

const CLAIMS = { sub: "u1", email: "ada@x.com" }

describe("getServerSession", () => {
  beforeEach(() => {
    createSupabaseServerClientMock.mockReset()
  })

  it("devuelve anonymous si no hay claims", async () => {
    createSupabaseServerClientMock.mockResolvedValue(createFakeSupabase({}, { claims: null }))

    const result = await getServerSession()

    expect(result).toEqual({ kind: "anonymous", data: null, error: null })
  })

  it("devuelve error si fallan los claims", async () => {
    createSupabaseServerClientMock.mockResolvedValue(
      createFakeSupabase({}, { claimsError: "token vencido" }),
    )

    const result = await getServerSession()

    expect(result.kind).toBe("error")
    if (result.kind === "error") expect(result.error).toBe("token vencido")
  })

  it("mapea perfil, roles y homeRoute", async () => {
    createSupabaseServerClientMock.mockResolvedValue(
      createFakeSupabase(
        {
          perfiles: [
            {
              id: "u1",
              nombres: "Ada",
              apellidos: "Lovelace",
              email: "perfil@x.com",
              avatar_public_id: "avatar/1",
              activo: true,
            },
          ],
          perfil_rol: [
            { perfil_id: "u1", rol: "estudiante" },
            { perfil_id: "u1", rol: "admin" },
          ],
        },
        { claims: CLAIMS },
      ),
    )

    const result = await getServerSession()

    expect(result.kind).toBe("authenticated")
    if (result.kind === "authenticated") {
      expect(result.data).toEqual({
        id: "u1",
        email: "ada@x.com",
        displayName: "Ada Lovelace",
        avatarPublicId: "avatar/1",
        roles: ["estudiante", "admin"],
        homeRoute: "/dashboard/admin",
        isActive: true,
      })
    }
  })

  it("marca isActive:false cuando el perfil está inactivo", async () => {
    createSupabaseServerClientMock.mockResolvedValue(
      createFakeSupabase(
        {
          perfiles: [
            {
              id: "u1",
              nombres: "Ada",
              apellidos: "Lovelace",
              email: "ada@x.com",
              avatar_public_id: null,
              activo: false,
            },
          ],
          perfil_rol: [{ perfil_id: "u1", rol: "docente" }],
        },
        { claims: CLAIMS },
      ),
    )

    const result = await getServerSession()

    expect(result.kind).toBe("authenticated")
    if (result.kind === "authenticated") {
      expect(result.data.isActive).toBe(false)
      expect(result.data.roles).toEqual(["docente"])
      expect(result.data.homeRoute).toBe("/dashboard/teacher")
    }
  })

  it("cae al local-part del email cuando el perfil no tiene nombres", async () => {
    createSupabaseServerClientMock.mockResolvedValue(
      createFakeSupabase(
        {
          perfiles: [
            {
              id: "u1",
              nombres: null,
              apellidos: null,
              email: "fallback@x.com",
              avatar_public_id: null,
              activo: true,
            },
          ],
          perfil_rol: [],
        },
        { claims: { sub: "u1" } },
      ),
    )

    const result = await getServerSession()

    expect(result.kind).toBe("authenticated")
    if (result.kind === "authenticated") {
      expect(result.data.displayName).toBe("fallback")
      expect(result.data.email).toBe("fallback@x.com")
      expect(result.data.roles).toEqual([])
    }
  })

  it("devuelve error si falla la query de perfiles", async () => {
    createSupabaseServerClientMock.mockResolvedValue(
      createFakeSupabase.withError("perfiles", "boom", { perfiles: [], perfil_rol: [] }, { claims: CLAIMS }),
    )

    const result = await getServerSession()

    expect(result.kind).toBe("error")
    if (result.kind === "error") expect(result.error).toBe("boom")
  })

  it("devuelve error si falla la query de roles", async () => {
    createSupabaseServerClientMock.mockResolvedValue(
      createFakeSupabase.withError(
        "perfil_rol",
        "boom roles",
        {
          perfiles: [
            {
              id: "u1",
              nombres: "Ada",
              apellidos: "Lovelace",
              email: "ada@x.com",
              avatar_public_id: null,
              activo: true,
            },
          ],
          perfil_rol: [],
        },
        { claims: CLAIMS },
      ),
    )

    const result = await getServerSession()

    expect(result.kind).toBe("error")
    if (result.kind === "error") expect(result.error).toBe("boom roles")
  })
})
