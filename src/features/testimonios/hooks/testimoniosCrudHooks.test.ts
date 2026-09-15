import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const api = vi.hoisted(() => ({
  crearTestimonio: vi.fn(),
  updateTestimonio: vi.fn(),
  eliminarTestimonio: vi.fn(),
  persistCloudinaryImage: vi.fn(),
  deleteCloudinaryImage: vi.fn(),
}))

vi.mock("../api/crearTestimonio", () => ({ crearTestimonio: api.crearTestimonio }))
vi.mock("../api/updateTestimonio", () => ({ updateTestimonio: api.updateTestimonio }))
vi.mock("../api/eliminarTestimonio", () => ({ eliminarTestimonio: api.eliminarTestimonio }))
vi.mock("@/shared/api/persist-cloudinary-image", () => ({ persistCloudinaryImage: api.persistCloudinaryImage }))
vi.mock("@/shared/api/cloudinary-client", () => ({ deleteCloudinaryImage: api.deleteCloudinaryImage }))
vi.mock("sonner", () => ({ toast: { success: vi.fn(), warning: vi.fn(), error: vi.fn() } }))

import { createQueryWrapper, createTestQueryClient } from "@/test/query"

import { useCrearTestimonio } from "./useCrearTestimonio"
import { useEliminarTestimonio } from "./useEliminarTestimonio"
import { useUpdateTestimonio } from "./useUpdateTestimonio"

function wrapper() {
  return createQueryWrapper(createTestQueryClient())
}

const VALUES = {
  autor: "Ana Pérez",
  rol: "Estudiante de piano",
  cita: "Aprendí muchísimo en cada clase.",
  puntuacion: 5,
  publicId: "",
  file: null,
  removeImage: false,
  cursoId: "",
  docenteId: "",
  orden: 0,
  publicado: false,
}

describe("testimonios CRUD hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    api.persistCloudinaryImage.mockResolvedValue({ data: { id: "t1" }, error: null, cleanupError: null })
    api.eliminarTestimonio.mockResolvedValue({ data: { publicId: "gosmel/testimonios/ana" }, error: null })
    api.deleteCloudinaryImage.mockResolvedValue({ error: null })
  })

  it("crea y actualiza testimonios con foto", async () => {
    const crear = renderHook(() => useCrearTestimonio(), { wrapper: wrapper() })
    await act(async () => {
      await crear.result.current.mutateAsync(VALUES)
    })
    expect(api.persistCloudinaryImage).toHaveBeenCalledWith(
      expect.objectContaining({ folder: "gosmel/testimonios" }),
    )

    const actualizar = renderHook(() => useUpdateTestimonio(), { wrapper: wrapper() })
    await act(async () => {
      await actualizar.result.current.mutateAsync({ id: "t1", values: VALUES, currentPublicId: null })
    })
    expect(api.persistCloudinaryImage).toHaveBeenCalledTimes(2)
  })

  it("elimina el testimonio y su foto", async () => {
    const eliminar = renderHook(() => useEliminarTestimonio(), { wrapper: wrapper() })
    await act(async () => {
      await eliminar.result.current.mutateAsync("t1")
    })
    expect(api.eliminarTestimonio).toHaveBeenCalledWith("t1")
    expect(api.deleteCloudinaryImage).toHaveBeenCalledWith("gosmel/testimonios/ana")
  })
})
