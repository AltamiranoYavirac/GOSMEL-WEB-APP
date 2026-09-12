import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const { createSupabaseServerClientMock, uploadMock, destroyMock } = vi.hoisted(() => ({
  createSupabaseServerClientMock: vi.fn(),
  uploadMock: vi.fn(),
  destroyMock: vi.fn(),
}))

vi.mock("@/shared/api/cloudinary", () => ({
  cloudinary: { uploader: { upload: uploadMock, destroy: destroyMock } },
}))
vi.mock("@/shared/api/supabase/server", () => ({
  createSupabaseServerClient: createSupabaseServerClientMock,
}))

import { createFakeSupabase } from "@/test/supabase"
import type { TFakeTables } from "@/test/supabase.types"
import type { ISessionUser } from "@/entities/user"

import { eliminarAvatar } from "./eliminarAvatar"
import { eliminarAvatarServer } from "./eliminarAvatarServer"
import { subirAvatarServer } from "./subirAvatarServer"

function createFile(name = "foto.png", type = "image/png", size = 256) {
  return new File([new Uint8Array(size)], name, { type })
}

function makeSession(avatarPublicId: string | null = null): ISessionUser {
  return {
    id: "u1",
    email: "ada@x.com",
    displayName: "Ada",
    avatarPublicId,
    roles: ["estudiante"],
    homeRoute: "/dashboard/student",
    isActive: true,
  }
}

function setupSupabase(tables: TFakeTables = { perfiles: [{ id: "u1", avatar_public_id: null }] }) {
  createSupabaseServerClientMock.mockResolvedValue(createFakeSupabase(tables))
  return tables
}

describe("subirAvatarServer", () => {
  beforeEach(() => {
    createSupabaseServerClientMock.mockReset()
    uploadMock.mockReset()
    destroyMock.mockReset()
    uploadMock.mockResolvedValue({
      public_id: "gosmel/avatares/nuevo",
      secure_url: "https://res.cloudinary.com/x/gosmel/avatares/nuevo.png",
    })
    destroyMock.mockResolvedValue({ result: "ok" })
  })

  it("rechaza formatos no soportados sin tocar Cloudinary", async () => {
    const result = await subirAvatarServer(makeSession(), createFile("doc.txt", "text/plain"))

    expect(result).toEqual({
      data: null,
      error: "Formato no soportado. Usa una imagen JPG, PNG o WEBP.",
      status: 400,
    })
    expect(uploadMock).not.toHaveBeenCalled()
  })

  it("rechaza imágenes mayores a 10MB sin tocar Cloudinary", async () => {
    const file = createFile()
    Object.defineProperty(file, "size", { value: 10 * 1024 * 1024 + 1 })

    const result = await subirAvatarServer(makeSession(), file)

    expect(result).toEqual({ data: null, error: "La imagen supera el límite de 10MB", status: 400 })
    expect(uploadMock).not.toHaveBeenCalled()
  })

  it("sube a gosmel/avatares y persiste avatar_public_id del usuario", async () => {
    const tables = setupSupabase()

    const result = await subirAvatarServer(makeSession(), createFile())

    expect(uploadMock).toHaveBeenCalledWith(
      expect.stringMatching(/^data:image\/png;base64,/),
      expect.objectContaining({ folder: "gosmel/avatares", resource_type: "image" }),
    )
    expect(tables.perfiles[0].avatar_public_id).toBe("gosmel/avatares/nuevo")
    expect(result).toEqual({
      data: { publicId: "gosmel/avatares/nuevo", url: "https://res.cloudinary.com/x/gosmel/avatares/nuevo.png" },
      error: null,
      status: 200,
    })
  })

  it("destruye el avatar anterior si pertenece a la carpeta gestionada", async () => {
    setupSupabase({ perfiles: [{ id: "u1", avatar_public_id: "gosmel/avatares/viejo" }] })

    await subirAvatarServer(makeSession("gosmel/avatares/viejo"), createFile())

    expect(destroyMock).toHaveBeenCalledWith("gosmel/avatares/viejo")
  })

  it("no destruye assets ajenos a la carpeta de avatares", async () => {
    setupSupabase()

    await subirAvatarServer(makeSession("gosmel/cursos/portada"), createFile())
    await subirAvatarServer(makeSession("https://res.cloudinary.com/x/legacy.png"), createFile())

    expect(destroyMock).not.toHaveBeenCalled()
  })

  it("destruye el asset recién subido si falla el update en perfiles", async () => {
    createSupabaseServerClientMock.mockResolvedValue(
      createFakeSupabase({ perfiles: [{ id: "u1" }] }, { operationErrors: { "perfiles:update": "boom" } }),
    )

    const result = await subirAvatarServer(makeSession(), createFile())

    expect(destroyMock).toHaveBeenCalledWith("gosmel/avatares/nuevo")
    expect(result).toEqual({ data: null, error: "No se pudo guardar la foto en tu perfil", status: 500 })
  })

  it("responde 500 si Cloudinary falla", async () => {
    setupSupabase()
    uploadMock.mockRejectedValue(new Error("cloudinary caído"))

    const result = await subirAvatarServer(makeSession(), createFile())

    expect(result).toEqual({ data: null, error: "No se pudo subir la foto de perfil", status: 500 })
  })
})

describe("eliminarAvatarServer", () => {
  beforeEach(() => {
    createSupabaseServerClientMock.mockReset()
    destroyMock.mockReset()
    destroyMock.mockResolvedValue({ result: "ok" })
  })

  it("limpia avatar_public_id y destruye el asset gestionado", async () => {
    const tables = setupSupabase({ perfiles: [{ id: "u1", avatar_public_id: "gosmel/avatares/viejo" }] })

    const result = await eliminarAvatarServer(makeSession("gosmel/avatares/viejo"))

    expect(tables.perfiles[0].avatar_public_id).toBeNull()
    expect(destroyMock).toHaveBeenCalledWith("gosmel/avatares/viejo")
    expect(result).toEqual({ data: { eliminado: true }, error: null, status: 200 })
  })

  it("tolera que destroy falle para assets gestionados", async () => {
    setupSupabase({ perfiles: [{ id: "u1", avatar_public_id: "gosmel/avatares/viejo" }] })
    destroyMock.mockRejectedValue(new Error("destroy falló"))

    await expect(eliminarAvatarServer(makeSession("gosmel/avatares/viejo"))).resolves.toEqual({
      data: { eliminado: true },
      error: null,
      status: 200,
    })
  })

  it("no destruye assets ajenos a la carpeta de avatares", async () => {
    setupSupabase({ perfiles: [{ id: "u1", avatar_public_id: "gosmel/cursos/x" }] })

    const result = await eliminarAvatarServer(makeSession("gosmel/cursos/x"))

    expect(destroyMock).not.toHaveBeenCalled()
    expect(result).toEqual({ data: { eliminado: true }, error: null, status: 200 })
  })

  it("responde 500 si el update falla y no destruye nada", async () => {
    createSupabaseServerClientMock.mockResolvedValue(
      createFakeSupabase({ perfiles: [] }, { operationErrors: { "perfiles:update": "boom" } }),
    )

    const result = await eliminarAvatarServer(makeSession("gosmel/avatares/viejo"))

    expect(destroyMock).not.toHaveBeenCalled()
    expect(result).toEqual({ data: null, error: "No se pudo quitar la foto de perfil", status: 500 })
  })
})

describe("eliminarAvatar", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("devuelve data cuando el endpoint responde ok", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: { eliminado: true }, error: null }),
    })
    vi.stubGlobal("fetch", fetchMock)

    await expect(eliminarAvatar()).resolves.toEqual({ data: { eliminado: true }, error: null })
    expect(fetchMock).toHaveBeenCalledWith("/api/upload/avatar", { method: "DELETE" })
  })

  it("mapea el error del endpoint y el fallo de red", async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal("fetch", fetchMock)

    fetchMock.mockResolvedValue({ ok: false, json: async () => ({ data: null, error: "boom" }) })
    await expect(eliminarAvatar()).resolves.toEqual({ data: null, error: "boom" })

    fetchMock.mockRejectedValue(new Error("red caída"))
    await expect(eliminarAvatar()).resolves.toEqual({ data: null, error: "red caída" })
  })
})
