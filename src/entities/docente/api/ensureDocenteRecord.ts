import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function ensureDocenteRecord(
  supabase: ReturnType<typeof createSupabaseBrowserClient>,
  perfilId: string
): Promise<void> {
  if (!perfilId) return;

  const { data: existing } = await supabase
    .from("docentes")
    .select("perfil_id")
    .eq("perfil_id", perfilId)
    .maybeSingle();

  if (existing) return;

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("nombres, apellidos")
    .eq("id", perfilId)
    .maybeSingle();

  const baseSlug = `${perfil?.nombres ?? "docente"}-${perfil?.apellidos ?? ""}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") || `docente-${perfilId.slice(0, 6)}`;

  await supabase.from("docentes").insert({
    perfil_id: perfilId,
    slug: `${baseSlug}-${perfilId.slice(0, 4)}`,
  });
}
