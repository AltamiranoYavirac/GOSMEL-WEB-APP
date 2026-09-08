export interface ICompressImageOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  maxSizeInBytes?: number
}

export function compressImageFile(
  file: File,
  options: ICompressImageOptions = {}
): Promise<File> {
  const {
    maxWidth = 512,
    maxHeight = 512,
    quality = 0.85,
    maxSizeInBytes = 2 * 1024 * 1024,
  } = options

  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      let { width, height } = img
      const scale = Math.min(maxWidth / width, maxHeight / height, 1)
      width = Math.round(width * scale)
      height = Math.round(height * scale)

      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("No se pudo obtener el contexto del canvas"))
        return
      }
      ctx.drawImage(img, 0, 0, width, height)

      const outputType = file.type === "image/png" ? "image/png" : "image/jpeg"

      const tryCompress = (q: number): void => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("No se pudo generar el blob de la imagen"))
              return
            }
            if (blob.size > maxSizeInBytes && q > 0.5) {
              tryCompress(q - 0.05)
              return
            }
            resolve(
              new File([blob], file.name, {
                type: outputType,
                lastModified: Date.now(),
              })
            )
          },
          outputType,
          q
        )
      }

      tryCompress(quality)
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("No se pudo cargar la imagen"))
    }

    img.src = url
  })
}
