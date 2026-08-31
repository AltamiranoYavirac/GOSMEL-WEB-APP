import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export interface IEliminarEstudianteResult {
  deleted: boolean;
}

export async function eliminarEstudiante(
  id: string,
  perfilId: string | null
): Promise<{ data: IEliminarEstudianteResult | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const [inscripciones, acuerdos] = await Promise.all([
    supabase.from("inscripciones").select("id", { count: "exact", head: true }).eq("estudiante_id", id),
    supabase.from("acuerdos_pago").select("id", { count: "exact", head: true }).eq("estudiante_id", id),
  ]);

  const firstError = [inscripciones, acuerdos].map((result) => result.error).find(Boolean);
  if (firstError) {
    return { data: null, error: firstError.message };
  }

  const tieneHistorial = (inscripciones.count ?? 0) > 0 || (acuerdos.count ?? 0) > 0;

  if (perfilId) {
    const { error: rolError } = await supabase
      .from("perfil_rol")
      .delete()
      .eq("perfil_id", perfilId)
      .eq("rol", "estudiante");
    if (rolError) return { data: null, error: rolError.message };
  }

  if (tieneHistorial) {
    const { error: fichaError } = await supabase
      .from("estudiantes")
      .update({ activo: false })
      .eq("id", id);
    if (fichaError) return { data: null, error: fichaError.message };
    return { data: { deleted: false }, error: null };
  }

  const limpieza = await Promise.all([
    supabase.from("estudiante_representante").delete().eq("estudiante_id", id),
    supabase.from("estudiante_instrumento").delete().eq("estudiante_id", id),
    supabase.from("registros_practica").delete().eq("estudiante_id", id),
    supabase.from("actividades").delete().eq("estudiante_id", id),
    supabase.from("curso_resenas").delete().eq("estudiante_id", id),
  ]);

  const limpiezaError = limpieza.map((result) => result.error).find(Boolean);
  if (limpiezaError) {
    return { data: null, error: limpiezaError.message };
  }

  const { error: fichaError } = await supabase.from("estudiantes").delete().eq("id", id);
  if (fichaError) {
    return { data: null, error: fichaError.message };
  }

  return { data: { deleted: true }, error: null };
}