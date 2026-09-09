export async function updateUsuarioActivo(
  id: string,
  activo: boolean
): Promise<{ data: { id: string } | null; error: string | null }> {
  try {
    const response = await fetch(`/api/admin/users/${id}/status`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ activo }),
    });

    const result = (await response.json()) as {
      data: { id: string } | null;
      error: string | null;
    };

    if (!response.ok) {
      return { data: null, error: result.error ?? "No se pudo actualizar el estado" };
    }

    return result;
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "No se pudo actualizar el estado" };
  }
}
