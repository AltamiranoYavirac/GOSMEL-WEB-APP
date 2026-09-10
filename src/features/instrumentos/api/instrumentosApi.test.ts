import { beforeEach, describe, expect, it } from "vitest"

const { createSupabaseBrowserClientMock } = vi.hoisted(() => ({
  createSupabaseBrowserClientMock: vi.fn(),
}))

vi.mock("@/shared/api/supabase/client", () => ({
  createSupabaseBrowserClient: createSupabaseBrowserClientMock,
}))

import { createFakeSupabase } from "@/test/supabase"
import type { TFakeSupabaseClient } from "@/test/supabase.types"

import { crearInstrumento, eliminarInstrumento as eliminarInstrumentoDirecto, updateInstrumento } from "./crearInstrumento"
import { eliminarInstrumento } from "./eliminarInstrumento"
import { getInstrumentos } from "./getInstrumentos"
import { crearTipoInstrumento, eliminarTipoInstrumento, getTiposInstrumento } from "./getTiposInstrumento"

function configure(tables: Record<string, Record<string, unknown>[]> = {}): TFakeSupabaseClient {
  const fake = createFakeSupabase(tables)
  createSupabaseBrowserClientMock.mockReturnValue(fake)
  return fake
}

const INSTRUMENTO_VALUES = { nombre: " Guitarra ", tipoInstrumentoId: "t1", icono: " ph:guitar ", orden: 1, activo: true }

describe("instrumentos API", () => {
  beforeEach(() => {
    createSupabaseBrowserClientMock.mockReset()
  })

  it("getInstrumentos mapea familia y defaults", async () => {
    const result = await getInstrumentos(
      createFakeSupabase({
        instrumentos: [
          {
            id: "i1",
            nombre: "Guitarra",
            slug: "guitarra",
            tipo_instrumento_id: "t1",
            icono: "ph:guitar",
            imagen_public_id: null,
            orden: 1,
            activo: true,
            tipos_instrumento: { nombre: "Cuerdas" },
          },
          {
            id: "i2",
            nombre: "Cajón",
            slug: "cajon",
            tipo_instrumento_id: null,
            icono: null,
            imagen_public_id: null,
            orden: 2,
            activo: false,
            tipos_instrumento: null,
          },
        ],
      }),
    )

    expect(result.data![0]).toMatchObject({ tipo: "Cuerdas", imagenPublicId: null })
    expect(result.data![1].tipo).toBe("Sin familia")
  })

  it("crearInstrumento genera slug y updateInstrumento responde id", async () => {
    configure({ instrumentos: [{ id: "i1" }] })

    const created = await crearInstrumento(INSTRUMENTO_VALUES)
    expect(created.data).toEqual({ id: expect.any(String) })

    await expect(updateInstrumento("i1", INSTRUMENTO_VALUES)).resolves.toEqual({ data: { id: "i1" }, error: null })
  })

  it("eliminarInstrumento del módulo crear responde sin error", async () => {
    configure({ instrumentos: [{ id: "i1" }] })

    await expect(eliminarInstrumentoDirecto("i1")).resolves.toEqual({ error: null })
  })

  it("eliminarInstrumento bloquea si hay cursos asociados", async () => {
    configure({ cursos: [{ id: "k1", instrumento_id: "i1" }] })

    const blocked = await eliminarInstrumento("i1")
    expect(blocked.error).toContain("No se puede eliminar el instrumento")

    configure({ cursos: [], instrumentos: [{ id: "i1" }] })
    await expect(eliminarInstrumento("i1")).resolves.toEqual({ error: null })
  })

  it("gestiona tipos de instrumento", async () => {
    const list = await getTiposInstrumento(
      createFakeSupabase({ tipos_instrumento: [{ id: "t1", nombre: "Cuerdas", orden: 1, activo: true }] }),
    )
    expect(list.data![0]).toEqual({ id: "t1", nombre: "Cuerdas", orden: 1, activo: true })

    configure({ tipos_instrumento: [{ id: "t1" }] })
    await expect(crearTipoInstrumento({ nombre: " Viento ", orden: 2, activo: true })).resolves.toEqual({
      data: { id: expect.any(String) },
      error: null,
    })
    await expect(eliminarTipoInstrumento("t1")).resolves.toEqual({ error: null })
  })

  it("propaga errores", async () => {
    createSupabaseBrowserClientMock.mockReturnValue(createFakeSupabase.withError("instrumentos", "boom"))

    await expect(crearInstrumento(INSTRUMENTO_VALUES)).resolves.toEqual({ data: null, error: "boom" })
    await expect(getInstrumentos(createFakeSupabase.withError("instrumentos", "boom"))).resolves.toEqual({
      data: null,
      error: "boom",
    })
  })
})
