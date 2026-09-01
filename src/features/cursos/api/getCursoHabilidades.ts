import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export interface ICursoHabilidad {
  id: string;
  cursoId: string;
  habilidad: string;
  orden: number;
}

export async function getCursoHabilidades(
  cursoId: string
): Promise<{ data: ICursoHabilidad[] | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("curso_habilidades")
    .select("id, curso_id, habilidad, orden")
    .eq("curso_id", cursoId)
    .order("orden", { ascending: true });

  if (error) {
    return { data: null, error: error.message };
  }

  const rows: ICursoHabilidad[] = (data ?? []).map((row) => ({
    id: row.id,
    cursoId: row.curso_id,
    habilidad: row.habilidad,
    orden: row.orden,
  }));

  return { data: rows, error: null };
}

export async function crearHabilidad(
  cursoId: string,
  habilidad: string,
  orden = 0
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("curso_habilidades")
    .insert({
      curso_id: cursoId,
      habilidad: habilidad.trim(),
      orden,
    })
    .select("id")
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function eliminarHabilidad(
  habilidadId: string
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.from("curso_habilidades").delete().eq("id", habilidadId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
