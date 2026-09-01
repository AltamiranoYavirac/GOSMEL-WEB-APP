import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export interface IUpdateDocentePatch {
  titulo_profesional?: string | null;
  biografia?: string | null;
  frase_destacada?: string | null;
  anios_experiencia?: number | null;
  redes_sociales?: Record<string, any>;
  publicado?: boolean;
  destacado?: boolean;
  orden?: number;
}

export async function updateDocente(
  id: string,
  patch: IUpdateDocentePatch
): Promise<{ data: { perfil_id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("docentes")
    .update({
      ...patch,
      updated_at: new Date().toISOString(),
    })
    .eq("perfil_id", id)
    .select("perfil_id")
    .maybeSingle();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}