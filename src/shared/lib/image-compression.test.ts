import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { compressImageFile } from "./image-compression"

function createFile(name = "foto.jpg", type = "image/jpeg", size = 512) {
  return new File([new Uint8Array(size)], name, { type })
}

function stubImage({ width = 1200, height = 600, fail = false } = {}) {
  class FakeImage {
    width = width
    height = height
    onload: (() => void) | null = null
    onerror: (() => void) | null = null

    set src(_value: string) {
      queueMicrotask(() => (fail ? this.onerror?.() : this.onload?.()))
    }
  }

  vi.stubGlobal("Image", FakeImage)
}

function stubCanvas(blobs: Array<Blob | null>, context: unknown = { drawImage: vi.fn() }) {
  const canvas = {
    width: 0,
    height: 0,
    getContext: vi.fn(() => context),
    toBlob: vi.fn((callback: BlobCallback) => {
      const blob = blobs.length > 0 ? blobs.shift()! : new Blob([new Uint8Array(16)])
      callback(blob)
    }),
  }

  const original = document.createElement.bind(document)
  vi.spyOn(document, "createElement").mockImplementation((((tag: string) => {
    if (tag === "canvas") return canvas
    return original(tag)
  }) as unknown) as typeof document.createElement)

  return canvas
}

describe("compressImageFile", () => {
  beforeEach(() => {
    vi.stubGlobal("URL", {
      createObjectURL: vi.fn(() => "blob:test"),
      revokeObjectURL: vi.fn(),
    })
    stubImage()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it("devuelve un File con el mismo nombre y tipo jpeg para no-png", async () => {
    stubCanvas([new Blob([new Uint8Array(64)])])

    const result = await compressImageFile(createFile("foto.jpg", "image/jpeg"))

    expect(result).toBeInstanceOf(File)
    expect(result.name).toBe("foto.jpg")
    expect(result.type).toBe("image/jpeg")
  })

  it("conserva el tipo png", async () => {
    stubCanvas([new Blob([new Uint8Array(64)])])

    const result = await compressImageFile(createFile("foto.png", "image/png"))

    expect(result.type).toBe("image/png")
  })

  it("escala la imagen según maxWidth/maxHeight", async () => {
    const canvas = stubCanvas([new Blob([new Uint8Array(64)])])

    await compressImageFile(createFile(), { maxWidth: 512, maxHeight: 512 })

    expect(canvas.width).toBe(512)
    expect(canvas.height).toBe(256)
  })

  it("reintenta con menos calidad si el blob supera maxSizeInBytes", async () => {
    const canvas = stubCanvas([new Blob([new Uint8Array(200)]), new Blob([new Uint8Array(50)])])

    await compressImageFile(createFile(), { maxSizeInBytes: 100 })

    expect(canvas.toBlob).toHaveBeenCalledTimes(2)
  })

  it("rechaza si no hay contexto 2d", async () => {
    stubCanvas([new Blob([new Uint8Array(10)])], null)

    await expect(compressImageFile(createFile())).rejects.toThrow(
      "No se pudo obtener el contexto del canvas",
    )
  })

  it("rechaza si el canvas no genera blob", async () => {
    stubCanvas([null])

    await expect(compressImageFile(createFile())).rejects.toThrow(
      "No se pudo generar el blob de la imagen",
    )
  })

  it("rechaza si la imagen no carga", async () => {
    stubImage({ fail: true })

    await expect(compressImageFile(createFile())).rejects.toThrow("No se pudo cargar la imagen")
  })
})
