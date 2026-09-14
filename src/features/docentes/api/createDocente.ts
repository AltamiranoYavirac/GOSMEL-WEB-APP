import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export interface ICreateDocenteInput {
  perfil_id: string;
  slug: string;
  titulo_profesional?: string;
  biografia?: string;
  frase_destacada?: string;
  anios_experiencia?: number;
  publicado?: boolean;
  destacado?: boolean;
  instrumento_ids?: string[];
  instrumento_principal_id?: string;
}

export async function createDocente(input: ICreateDocenteInput): Promise<{
  data: { perfil_id: string } | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();

  const { data, error } = await supabase.rpc("registrar_docente", {
    p_perfil_id: input.perfil_id,
    p_slug: input.slug.toLowerCase().trim(),
    p_titulo_profesional: input.titulo_profesional?.trim() || undefined,
    p_biografia: input.biografia?.trim() || undefined,
    p_frase_destacada: input.frase_destacada?.trim() || undefined,
    p_anios_experiencia: input.anios_experiencia ?? undefined,
    p_publicado: Boolean(input.publicado),
    p_destacado: Boolean(input.destacado),
    p_instrumento_ids: input.instrumento_ids ?? [],
    p_instrumento_principal_id: input.instrumento_principal_id || undefined,
  });

  if (error || !data) {
    const message = error?.message ?? "Error al registrar docente";
    if (message.includes("docentes_slug_key") || message.includes("duplicate key")) {
      return { data: null, error: "Ya existe un docente con ese slug." };
    }
    return { data: null, error: message };
  }

  return { data: { perfil_id: data }, error: null };
}
