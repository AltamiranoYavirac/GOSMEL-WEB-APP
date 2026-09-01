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
  instrumento_id?: string;
}

export async function createDocente(input: ICreateDocenteInput): Promise<{
  data: { perfil_id: string } | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();

  const { data, error } = await supabase
    .from("docentes")
    .insert({
      perfil_id: input.perfil_id,
      slug: input.slug.toLowerCase().trim(),
      titulo_profesional: input.titulo_profesional?.trim() || null,
      biografia: input.biografia?.trim() || null,
      frase_destacada: input.frase_destacada?.trim() || null,
      anios_experiencia: input.anios_experiencia || 0,
      publicado: Boolean(input.publicado),
      destacado: Boolean(input.destacado),
    })
    .select("perfil_id")
    .single();

  if (error || !data) {
    return { data: null, error: error?.message ?? "Error al registrar docente" };
  }

  await supabase.from("perfil_rol").insert({
    perfil_id: input.perfil_id,
    rol: "docente",
  });

  if (input.instrumento_id) {
    await supabase.from("docente_instrumento").insert({
      docente_id: input.perfil_id,
      instrumento_id: input.instrumento_id,
      es_principal: true,
    });
  }

  return { data, error: null };
}
