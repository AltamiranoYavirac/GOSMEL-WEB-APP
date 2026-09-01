import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function eliminarCatedra(
  catedraId: string
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const { data: inscripciones, error: inscError } = await supabase
    .from("inscripciones")
    .select("id, estado")
    .eq("catedra_id", catedraId);

  if (inscError) {
    return { error: inscError.message };
  }

  const activas = (inscripciones ?? []).filter(
    (i) => i.estado === "activa" || i.estado === "pendiente"
  );

  if (activas.length > 0) {
    return {
      error: `No se puede eliminar la cátedra porque tiene ${activas.length} estudiante(s) matriculado(s). Debe dar de baja a los estudiantes o cambiar el estado a «Cancelada».`,
    };
  }

  await supabase.from("sesiones").delete().eq("catedra_id", catedraId);
  await supabase.from("catedra_horarios").delete().eq("catedra_id", catedraId);
  await supabase.from("inscripciones").delete().eq("catedra_id", catedraId);

  const { error: deleteError } = await supabase.from("catedras").delete().eq("id", catedraId);
  if (deleteError) {
    return { error: deleteError.message };
  }

  return { error: null };
}
