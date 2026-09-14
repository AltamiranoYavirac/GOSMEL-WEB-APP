import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function ensureDocenteRecord(
  supabase: ReturnType<typeof createSupabaseBrowserClient>,
  perfilId: string
): Promise<{ error: string | null }> {
  if (!perfilId) return { error: "Selecciona un docente." };

  const { error } = await supabase.rpc("registrar_docente", {
    p_perfil_id: perfilId,
  });

  return { error: error?.message ?? null };
}
