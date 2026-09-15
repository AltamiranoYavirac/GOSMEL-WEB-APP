import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const api = vi.hoisted(() => ({
  crearSeccion: vi.fn(),
  actualizarSeccion: vi.fn(),
  eliminarSeccion: vi.fn(),
  persistCloudinaryImage: vi.fn(),
  deleteCloudinaryImage: vi.fn(),
}))

vi.mock("../api/crearSeccion", () => ({ crearSeccion: api.crearSeccion }))
vi.mock("../api/actualizarSeccion", () => ({ actualizarSeccion: api.actualizarSeccion }))
vi.mock("../api/eliminarSeccion", () => ({ eliminarSeccion: api.eliminarSeccion }))
vi.mock("@/shared/api/persist-cloudinary-image", () => ({ persistCloudinaryImage: api.persistCloudinaryImage }))
vi.mock("@/shared/api/cloudinary-client", () => ({ deleteCloudinaryImage: api.deleteCloudinaryImage }))
vi.mock("sonner", () => ({ toast: { success: vi.fn(), warning: vi.fn(), error: vi.fn() } }))

import { createQueryWrapper, createTestQueryClient } from "@/test/query"

import { useActualizarSeccion } from "./useActualizarSeccion"
import { useCrearSeccion } from "./useCrearSeccion"
import { useEliminarSeccion } from "./useEliminarSeccion"

function wrapper() {
  return createQueryWrapper(createTestQueryClient())
}

const VALUES = {
  clave: "mision",
  titulo: "Misión",
  contenido: "Formar músicos con excelencia y sensibilidad.",
  publicId: "",
  file: null,
  removeImage: false,
  alt: "",
  orden: 0,
  publicado: true,
}

describe("secciones CRUD hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    api.persistCloudinaryImage.mockResolvedValue({ data: { id: "s1" }, error: null, cleanupError: null })
    api.eliminarSeccion.mockResolvedValue({ data: { publicId: "gosmel/secciones/mision" }, error: null })
    api.deleteCloudinaryImage.mockResolvedValue({ error: null })
  })

  it("crea y actualiza secciones vía Cloudinary", async () => {
    const crear = renderHook(() => useCrearSeccion(), { wrapper: wrapper() })
    await act(async () => {
      await crear.result.current.mutateAsync(VALUES)
    })
    expect(api.persistCloudinaryImage).toHaveBeenCalledWith(
      expect.objectContaining({ file: null, folder: "gosmel/secciones" }),
    )

    const actualizar = renderHook(() => useActualizarSeccion(), { wrapper: wrapper() })
    await act(async () => {
      await actualizar.result.current.mutateAsync({ id: "s1", values: VALUES, currentPublicId: null })
    })
    expect(api.persistCloudinaryImage).toHaveBeenCalledTimes(2)
  })

  it("elimina la sección y limpia la imagen de Cloudinary", async () => {
    const eliminar = renderHook(() => useEliminarSeccion(), { wrapper: wrapper() })
    await act(async () => {
      await eliminar.result.current.mutateAsync("s1")
    })
    expect(api.eliminarSeccion).toHaveBeenCalledWith("s1")
    expect(api.deleteCloudinaryImage).toHaveBeenCalledWith("gosmel/secciones/mision")
  })
})
