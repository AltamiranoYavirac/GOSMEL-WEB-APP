import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const { createSupabaseBrowserClientMock, createSupabaseServerClientMock, createSupabaseAdminClientMock } = vi.hoisted(() => ({
  createSupabaseBrowserClientMock: vi.fn(),
  createSupabaseServerClientMock: vi.fn(),
  createSupabaseAdminClientMock: vi.fn(),
}))

vi.mock("@/shared/api/supabase/client", () => ({
  createSupabaseBrowserClient: createSupabaseBrowserClientMock,
}))
vi.mock("@/shared/api/supabase/server", () => ({
  createSupabaseServerClient: createSupabaseServerClientMock,
}))
vi.mock("@/shared/api/supabase/admin", () => ({
  createSupabaseAdminClient: createSupabaseAdminClientMock,
}))

import { createFakeSupabase } from "@/test/supabase"
import type { TFakeSupabaseClient } from "@/test/supabase.types"

import { asignarEstudiante } from "./asignarEstudiante"
import { asignarRolAdmin } from "./asignarRolAdmin"
import { asignarRolDocente } from "./asignarRolDocente"
import { getPerfilActual } from "./getPerfilActual"
import { getUsuarios } from "./getUsuarios"
import { quitarRol } from "./quitarRol"
import { updateUsuarioActivo } from "./updateUsuarioActivo"
import { updateUsuarioActivoServer } from "./updateUsuarioActivoServer"
import { updateUsuarioContacto } from "./updateUsuarioContacto"

function configure(tables: Record<string, Record<string, unknown>[]> = {}): TFakeSupabaseClient {
  const fake = createFakeSupabase(tables, { user: { id: "u1" } })
  createSupabaseBrowserClientMock.mockReturnValue(fake)
  return fake
}

function withAdminAuth(fake: TFakeSupabaseClient, updateUserById: ReturnType<typeof vi.fn>): TFakeSupabaseClient {
  ;(fake.auth as unknown as { admin: { updateUserById: unknown } }).admin = { updateUserById }
  return fake
}

describe("usuarios API", () => {
  beforeEach(() => {
    createSupabaseBrowserClientMock.mockReset()
    createSupabaseServerClientMock.mockReset()
    createSupabaseAdminClientMock.mockReset()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("getUsuarios mapea roles", async () => {
    const result = await getUsuarios(
      createFakeSupabase({
        perfiles: [
          {
            id: "u1",
            nombres: "Ada",
            apellidos: "Lovelace",
            email: "ada@x.com",
            cedula: "123",
            celular: null,
            activo: true,
            perfil_rol: [{ rol: "admin" }, { rol: "docente" }],
          },
        ],
      }),
    )

    expect(result.data![0]).toMatchObject({ nombre: "Ada Lovelace", roles: ["admin", "docente"] })
  })

  it("asignarEstudiante vincula ficha por cédula o crea una nueva", async () => {
    const fake = configure({
      estudiantes: [{ id: "e1", perfil_id: null, cedula: "123" }],
      perfil_rol: [],
    })

    const result = await asignarEstudiante("p1", "Ada Lovelace", { cedula: "123", fechaNacimiento: "2010-01-01", nivel: "basico" })

    expect(result).toEqual({ data: { perfilId: "p1" }, error: null })
    expect(fake).toBeTruthy()

    configure({ estudiantes: [], perfil_rol: [] })
    const created = await asignarEstudiante("p2", "Grace Hopper", { cedula: null, fechaNacimiento: "2010-01-01", nivel: null })
    expect(created).toEqual({ data: { perfilId: "p2" }, error: null })
  })

  it("asignarEstudiante omite el rol si ya existe", async () => {
    configure({
      estudiantes: [{ id: "e1", perfil_id: "p1" }],
      perfil_rol: [{ perfil_id: "p1", rol: "estudiante" }],
    })

    await expect(
      asignarEstudiante("p1", "Ada Lovelace", { cedula: null, fechaNacimiento: "2010-01-01", nivel: null }),
    ).resolves.toEqual({ data: { perfilId: "p1" }, error: null })
  })

  it("asignarRolDocente crea ficha y rol cuando faltan", async () => {
    configure({ perfil_rol: [], docentes: [] })

    const result = await asignarRolDocente("p1", "José Núñez")

    expect(result).toEqual({ data: { perfilId: "p1" }, error: null })
  })

  it("asignarRolDocente no duplica existentes y propaga error", async () => {
    configure({ perfil_rol: [{ perfil_id: "p1", rol: "docente" }], docentes: [{ perfil_id: "p1" }] })
    await expect(asignarRolDocente("p1", "Ada")).resolves.toEqual({ data: { perfilId: "p1" }, error: null })

    createSupabaseBrowserClientMock.mockReturnValue(
      createFakeSupabase.withError("rpc:registrar_docente", "boom"),
    )
    await expect(asignarRolDocente("p1", "Ada")).resolves.toEqual({ data: null, error: "boom" })
  })

  it("quitarRol elimina el rol indicado, incluido admin", async () => {
    configure({ perfil_rol: [{ perfil_id: "p1", rol: "admin" }, { perfil_id: "p1", rol: "docente" }] })

    await expect(quitarRol("p1", "admin")).resolves.toEqual({ data: { perfilId: "p1" }, error: null })
    await expect(quitarRol("p1", "docente")).resolves.toEqual({ data: { perfilId: "p1" }, error: null })
  })

  it("quitarRol propaga el error de la base", async () => {
    createSupabaseBrowserClientMock.mockReturnValue(
      createFakeSupabase.withError("perfil_rol", "No puedes quitarte a ti mismo el rol de administrador"),
    )

    await expect(quitarRol("p1", "admin")).resolves.toEqual({
      data: null,
      error: "No puedes quitarte a ti mismo el rol de administrador",
    })
  })

  it("asignarRolAdmin inserta el rol con el autor", async () => {
    const tables = { perfil_rol: [] as Record<string, unknown>[] }
    createSupabaseBrowserClientMock.mockReturnValue(
      createFakeSupabase(tables, { user: { id: "u1" } }),
    )

    await expect(asignarRolAdmin("p1")).resolves.toEqual({ data: { perfilId: "p1" }, error: null })
    expect(tables.perfil_rol[0]).toMatchObject({ perfil_id: "p1", rol: "admin", asignado_por: "u1" })
  })

  it("asignarRolAdmin propaga el error", async () => {
    createSupabaseBrowserClientMock.mockReturnValue(createFakeSupabase.withError("perfil_rol", "boom"))

    await expect(asignarRolAdmin("p1")).resolves.toEqual({ data: null, error: "boom" })
  })

  it("getPerfilActual devuelve el id de la sesión", async () => {
    configure({})

    await expect(getPerfilActual()).resolves.toEqual({ data: { id: "u1" }, error: null })
  })

  it("getPerfilActual devuelve null sin sesión y propaga error", async () => {
    createSupabaseBrowserClientMock.mockReturnValue(createFakeSupabase({}))
    await expect(getPerfilActual()).resolves.toEqual({ data: null, error: null })

    createSupabaseBrowserClientMock.mockReturnValue(createFakeSupabase({}, { userError: "boom" }))
    await expect(getPerfilActual()).resolves.toEqual({ data: null, error: "boom" })
  })

  it("updateUsuarioContacto responde id", async () => {
    configure({ perfiles: [{ id: "p1" }] })

    await expect(updateUsuarioContacto("p1", { cedula: " 123 ", celular: "" })).resolves.toEqual({
      data: { id: "p1" },
      error: null,
    })
  })

  it("updateUsuarioActivo usa el endpoint y mapea errores", async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal("fetch", fetchMock)

    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ data: { id: "u1" }, error: null }) })
    await expect(updateUsuarioActivo("u1", false)).resolves.toEqual({ data: { id: "u1" }, error: null })

    fetchMock.mockResolvedValue({ ok: false, json: async () => ({ data: null, error: "boom" }) })
    await expect(updateUsuarioActivo("u1", false)).resolves.toEqual({ data: null, error: "boom" })

    fetchMock.mockRejectedValue(new Error("red caída"))
    await expect(updateUsuarioActivo("u1", false)).resolves.toEqual({ data: null, error: "red caída" })
  })
})

describe("updateUsuarioActivoServer", () => {
  beforeEach(() => {
    createSupabaseServerClientMock.mockReset()
    createSupabaseAdminClientMock.mockReset()
  })

  function setupCaller(overrides: { claims?: { sub: string } | null; tables?: Record<string, Record<string, unknown>[]> }) {
    const caller = createFakeSupabase(
      overrides.tables ?? {
        perfiles: [{ id: "caller", activo: true }],
        perfil_rol: [{ perfil_id: "caller", rol: "admin" }],
      },
      { claims: overrides.claims === undefined ? { sub: "caller" } : overrides.claims },
    )
    createSupabaseServerClientMock.mockResolvedValue(caller)
    return caller
  }

  function setupAdmin(tables: Record<string, Record<string, unknown>[]>, authError: string | null = null) {
    const updateUserById = vi.fn(async () => (authError ? { error: { message: authError } } : { error: null }))
    const admin = withAdminAuth(createFakeSupabase(tables), updateUserById)
    createSupabaseAdminClientMock.mockReturnValue(admin)
    return { admin, updateUserById }
  }

  it("responde 401 sin sesión y 400 al desactivarse a sí mismo", async () => {
    setupCaller({ claims: null })
    await expect(updateUsuarioActivoServer("target", false)).resolves.toEqual({
      data: null,
      error: "Debes iniciar sesión",
      status: 401,
    })

    setupCaller({})
    await expect(updateUsuarioActivoServer("caller", false)).resolves.toEqual({
      data: null,
      error: "No puedes desactivar tu propia cuenta",
      status: 400,
    })
  })

  it("responde 403 si el caller está inactivo o no es admin", async () => {
    setupCaller({ tables: { perfiles: [{ id: "caller", activo: false }], perfil_rol: [] } })
    await expect(updateUsuarioActivoServer("target", true)).resolves.toEqual({
      data: null,
      error: "No tienes permisos para realizar esta acción",
      status: 403,
    })

    setupCaller({ tables: { perfiles: [{ id: "caller", activo: true }], perfil_rol: [{ perfil_id: "caller", rol: "docente" }] } })
    await expect(updateUsuarioActivoServer("target", true)).resolves.toEqual({
      data: null,
      error: "No tienes permisos para realizar esta acción",
      status: 403,
    })
  })

  it("responde 404 si el destino no existe", async () => {
    setupCaller({})
    setupAdmin({ perfiles: [] })

    await expect(updateUsuarioActivoServer("target", false)).resolves.toEqual({
      data: null,
      error: "Usuario no encontrado",
      status: 404,
    })
  })

  it("desactiva con éxito y bloquea al último admin", async () => {
    setupCaller({})
    const { updateUserById } = setupAdmin({ perfiles: [{ id: "target", activo: true }] })

    await expect(updateUsuarioActivoServer("target", false)).resolves.toEqual({ data: { id: "target" }, error: null, status: 200 })
    expect(updateUserById).toHaveBeenCalledWith("target", { ban_duration: "876000h" })
  })

  it("mapea el error del último administrador activo", async () => {
    setupCaller({})

    const admin = createFakeSupabase(
      { perfiles: [{ id: "target", activo: true }] },
      { operationErrors: { "perfiles:update": "al menos un administrador activo debe quedar" } },
    )
    withAdminAuth(admin, vi.fn())
    createSupabaseAdminClientMock.mockReturnValue(admin)

    await expect(updateUsuarioActivoServer("target", false)).resolves.toEqual({
      data: null,
      error: "Debe existir al menos un administrador activo",
      status: 400,
    })
  })

  it("reactiva la cuenta y propaga errores de auth", async () => {
    setupCaller({})
    setupAdmin({ perfiles: [{ id: "target", activo: false }] })

    await expect(updateUsuarioActivoServer("target", true)).resolves.toEqual({ data: { id: "target" }, error: null, status: 200 })

    setupCaller({})
    setupAdmin({ perfiles: [{ id: "target", activo: false }] }, "auth caída")

    await expect(updateUsuarioActivoServer("target", true)).resolves.toEqual({
      data: null,
      error: "No se pudo habilitar el acceso de la cuenta",
      status: 502,
    })
  })
})
