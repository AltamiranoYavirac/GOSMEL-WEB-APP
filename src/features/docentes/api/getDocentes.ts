import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IDocenteRow } from "../model/docente.types";

export async function getDocentes(): Promise<{
  data: IDocenteRow[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();

  const { data: rolesRol } = await supabase
    .from("perfil_rol")
    .select("perfil_id")
    .eq("rol", "docente");

  const perfilIdsConRol = (rolesRol ?? []).map((rol) => rol.perfil_id);

  const { data, error } = await supabase
    .from("docentes")
    .select(
      "perfil_id, titulo_profesional, anios_experiencia, destacado, publicado, perfiles!docentes_perfil_id_fkey(nombres, apellidos, email), docente_instrumento(instrumentos(nombre))"
    )
    .in("perfil_id", perfilIdsConRol)
    .order("perfiles(nombres)", { ascending: true })
    .limit(200);

  if (error) {
    return { data: null, error: error.message };
  }

  const rows: IDocenteRow[] = (data ?? []).map((docente) => ({
    id: docente.perfil_id,
    nombre: `${docente.perfiles?.nombres ?? ""} ${docente.perfiles?.apellidos ?? ""}`.trim(),
    email: docente.perfiles?.email ?? null,
    titulo: docente.titulo_profesional,
    instrumentos: (docente.docente_instrumento ?? [])
      .map((item) => item.instrumentos?.nombre ?? "")
      .filter(Boolean),
    aniosExperiencia: docente.anios_experiencia,
    destacado: docente.destacado,
    publicado: docente.publicado,
  }));

  return { data: rows, error: null };
}