export async function subirAvatar(file: File): Promise<{
  data: { publicId: string } | null
  error: string | null
}> {
  try {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/upload/avatar", {
      method: "POST",
      body: formData,
    })

    const result = (await response.json()) as {
      public_id?: string
      error: string | null
    }

    if (!response.ok || result.error || !result.public_id) {
      return { data: null, error: result.error ?? "No se pudo subir la foto de perfil" }
    }

    return { data: { publicId: result.public_id }, error: null }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "No se pudo subir la foto de perfil",
    }
  }
}
