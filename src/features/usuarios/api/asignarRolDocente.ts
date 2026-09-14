import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function asignarRolDocente(
  perfilId: string,
  nombre: string
): Promise<{ data: { perfilId: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const slugBase = slugify(nombre) || "docente";

  const { error } = await supabase.rpc("registrar_docente", {
    p_perfil_id: perfilId,
    p_slug: `${slugBase}-${perfilId.slice(0, 6)}`,
  });

  if (error) return { data: null, error: error.message };
  return { data: { perfilId }, error: null };
}
