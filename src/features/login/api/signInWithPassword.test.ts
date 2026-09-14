import { beforeEach, describe, expect, it, vi } from "vitest"

import type { TFakeSupabaseClient, TFakeTables } from "@/test/supabase.types"

const { createSupabaseBrowserClientMock } = vi.hoisted(() => ({
  createSupabaseBrowserClientMock: vi.fn(),
}))

vi.mock("@/shared/api/supabase/client", () => ({
  createSupabaseBrowserClient: createSupabaseBrowserClientMock,
}))

import { createFakeSupabase } from "@/test/supabase"
import { signInWithPassword } from "./signInWithPassword"

interface IBuildClientOptions {
  tables?: TFakeTables
  user?: { id: string } | null
  signInError?: string
}

function buildClient({ tables = {}, user = { id: "u1" }, signInError }: IBuildClientOptions = {}) {
  const fake = createFakeSupabase(tables)
  const signOut = vi.fn(async () => ({ error: null }))

  const client = {
    ...fake,
    auth: {
      signInWithPassword: vi.fn(async () =>
        signInError
          ? { data: { session: null, user: null }, error: { code: signInError } }
          : { data: { session: { access_token: "t" }, user }, error: null },
      ),
      signOut,
    },
  } as unknown as TFakeSupabaseClient

  return { client, signOut }
}

describe("signInWithPassword", () => {
  beforeEach(() => {
    createSupabaseBrowserClientMock.mockReset()
  })

  it("rechaza una cuenta sin rol y cierra la sesión", async () => {
    const { client, signOut } = buildClient({
      tables: { perfiles: [{ id: "u1", activo: true }], perfil_rol: [] },
    })
    createSupabaseBrowserClientMock.mockReturnValue(client)

    const result = await signInWithPassword({ email: "a@x.com", password: "secret" })

    expect(result).toEqual({ data: null, error: "sin_rol" })
    expect(signOut).toHaveBeenCalledTimes(1)
  })

  it("deja pasar cuando la cuenta tiene al menos un rol", async () => {
    const { client, signOut } = buildClient({
      tables: {
        perfiles: [{ id: "u1", activo: true }],
        perfil_rol: [{ perfil_id: "u1", rol: "docente" }],
      },
    })
    createSupabaseBrowserClientMock.mockReturnValue(client)

    const result = await signInWithPassword({ email: "a@x.com", password: "secret" })

    expect(result).toEqual({ data: { roles: ["docente"] }, error: null })
    expect(signOut).not.toHaveBeenCalled()
  })

  it("rechaza una cuenta inactiva", async () => {
    const { client, signOut } = buildClient({
      tables: {
        perfiles: [{ id: "u1", activo: false }],
        perfil_rol: [{ perfil_id: "u1", rol: "estudiante" }],
      },
    })
    createSupabaseBrowserClientMock.mockReturnValue(client)

    const result = await signInWithPassword({ email: "a@x.com", password: "secret" })

    expect(result).toEqual({ data: null, error: "account_inactive" })
    expect(signOut).toHaveBeenCalledTimes(1)
  })

  it("propaga el error de credenciales sin cerrar sesión", async () => {
    const { client, signOut } = buildClient({ signInError: "invalid_credentials" })
    createSupabaseBrowserClientMock.mockReturnValue(client)

    const result = await signInWithPassword({ email: "a@x.com", password: "bad" })

    expect(result).toEqual({ data: null, error: "invalid_credentials" })
    expect(signOut).not.toHaveBeenCalled()
  })
})
