export async function searchPhIcons(query: string): Promise<string[]> {
  const params = new URLSearchParams({ query, prefix: "ph", limit: "48" });
  const res = await fetch(`https://api.iconify.design/search?${params.toString()}`);
  if (!res.ok) throw new Error("No se pudo buscar iconos");
  const data = (await res.json()) as { icons?: string[] };
  return data.icons ?? [];
}
