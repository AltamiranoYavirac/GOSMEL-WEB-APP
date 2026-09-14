import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function ensureDocenteRecord(
  supabase: ReturnType<typeof createSupabaseBrowserClient>,
  perfilId: string
): Promise<{ error: string | null }> {
  if (!perfilId) return { error: "Selecciona un docente." };

  const { data: existing, error: readError } = await supabase
    .from("docentes")
    .select("perfil_id")
    .eq("perfil_id", perfilId)
    .maybeSingle();

  if (readError) return { error: readError.message };
  if (existing) return { error: null };

  const { error } = await supabase.from("docentes").insert({
    perfil_id: perfilId,
    slug: `docente-${perfilId.slice(0, 8)}`,
  });

  return { error: error?.message ?? null };
}
