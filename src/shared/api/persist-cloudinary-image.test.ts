import { beforeEach, describe, expect, it, vi } from "vitest"

const cloudinary = vi.hoisted(() => ({
  upload: vi.fn(),
  remove: vi.fn(),
}))

vi.mock("./cloudinary-client", () => ({
  uploadCloudinaryImage: cloudinary.upload,
  deleteCloudinaryImage: cloudinary.remove,
}))

import { persistCloudinaryImage } from "./persist-cloudinary-image"

describe("persistCloudinaryImage", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    cloudinary.upload.mockResolvedValue({ data: { publicId: "gosmel/cursos/nueva", secureUrl: "https://example.com/nueva" }, error: null })
    cloudinary.remove.mockResolvedValue({ error: null })
  })

  it("guarda el public_id nuevo antes de eliminar la imagen anterior", async () => {
    const persist = vi.fn().mockResolvedValue({ data: { id: "c1" }, error: null })
    const file = new File(["image"], "portada.jpg", { type: "image/jpeg" })

    const result = await persistCloudinaryImage({
      file,
      folder: "gosmel/cursos",
      currentPublicId: "gosmel/cursos/anterior",
      persist,
    })

    expect(persist).toHaveBeenCalledWith("gosmel/cursos/nueva")
    expect(cloudinary.remove).toHaveBeenCalledWith("gosmel/cursos/anterior")
    expect(persist.mock.invocationCallOrder[0]).toBeLessThan(cloudinary.remove.mock.invocationCallOrder[0])
    expect(result.error).toBeNull()
  })

  it("elimina la subida nueva y conserva la anterior cuando falla la base", async () => {
    const persist = vi.fn().mockResolvedValue({ data: null, error: "boom" })
    const file = new File(["image"], "portada.jpg", { type: "image/jpeg" })

    const result = await persistCloudinaryImage({
      file,
      folder: "gosmel/cursos",
      currentPublicId: "gosmel/cursos/anterior",
      persist,
    })

    expect(cloudinary.remove).toHaveBeenCalledTimes(1)
    expect(cloudinary.remove).toHaveBeenCalledWith("gosmel/cursos/nueva")
    expect(result.error).toBe("boom")
  })

  it("limpia la imagen anterior después de guardar null", async () => {
    const persist = vi.fn().mockResolvedValue({ data: { key: "hero" }, error: null })

    await persistCloudinaryImage({
      folder: "gosmel/sitio",
      currentPublicId: "gosmel/sitio/hero",
      removeCurrent: true,
      persist,
    })

    expect(persist).toHaveBeenCalledWith(null)
    expect(cloudinary.remove).toHaveBeenCalledWith("gosmel/sitio/hero")
  })
})
