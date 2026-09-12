export async function eliminarAvatar(): Promise<{
  data: { eliminado: true } | null
  error: string | null
}> {
  try {
    const response = await fetch("/api/upload/avatar", { method: "DELETE" })

    const result = (await response.json()) as {
      data: { eliminado: true } | null
      error: string | null
    }

    if (!response.ok) {
      return { data: null, error: result.error ?? "No se pudo quitar la foto de perfil" }
    }

    return result
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "No se pudo quitar la foto de perfil",
    }
  }
}
