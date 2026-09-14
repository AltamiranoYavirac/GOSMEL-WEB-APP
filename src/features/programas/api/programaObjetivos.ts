import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function agregarObjetivoPrograma(
  programaId: string,
  objetivo: string,
  orden: number
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("programa_objetivos")
    .insert({ programa_id: programaId, objetivo: objetivo.trim(), orden })
    .select("id")
    .single();

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function eliminarObjetivoPrograma(
  objetivoId: string
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.from("programa_objetivos").delete().eq("id", objetivoId);

  if (error) return { error: error.message };
  return { error: null };
}

export async function updateOrdenObjetivoPrograma(
  objetivoId: string,
  orden: number
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.from("programa_objetivos").update({ orden }).eq("id", objetivoId);

  if (error) return { error: error.message };
  return { error: null };
}
