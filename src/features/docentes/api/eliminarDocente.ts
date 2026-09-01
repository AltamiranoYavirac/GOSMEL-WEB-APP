import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export interface IEliminarDocenteResult {
  deleted: boolean;
}

export async function eliminarDocente(
  perfilId: string
): Promise<{ data: IEliminarDocenteResult | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const { count, error: catedrasError } = await supabase
    .from("catedras")
    .select("id", { count: "exact", head: true })
    .eq("docente_id", perfilId);
  if (catedrasError) {
    return { data: null, error: catedrasError.message };
  }

  const tieneCatedras = (count ?? 0) > 0;

  const { error: rolError } = await supabase
    .from("perfil_rol")
    .delete()
    .eq("perfil_id", perfilId)
    .eq("rol", "docente");
  if (rolError) {
    return { data: null, error: rolError.message };
  }

  if (tieneCatedras) {
    const { error: fichaError } = await supabase
      .from("docentes")
      .update({ publicado: false })
      .eq("perfil_id", perfilId);
    if (fichaError) {
      return { data: null, error: fichaError.message };
    }
    return { data: { deleted: false }, error: null };
  }

  const limpieza = await Promise.all([
    supabase.from("docente_formacion").delete().eq("docente_id", perfilId),
    supabase.from("docente_reconocimientos").delete().eq("docente_id", perfilId),
    supabase.from("docente_portafolio").delete().eq("docente_id", perfilId),
    supabase.from("docente_instrumento").delete().eq("docente_id", perfilId),
  ]);

  const limpiezaError = limpieza.map((result) => result.error).find(Boolean);
  if (limpiezaError) {
    return { data: null, error: limpiezaError.message };
  }

  const { error: fichaError } = await supabase.from("docentes").delete().eq("perfil_id", perfilId);
  if (fichaError) {
    return { data: null, error: fichaError.message };
  }

  return { data: { deleted: true }, error: null };
}