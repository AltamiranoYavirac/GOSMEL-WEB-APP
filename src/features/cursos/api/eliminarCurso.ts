import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function eliminarCurso(
  cursoId: string
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const { data: catedras, error: catError } = await supabase
    .from("catedras")
    .select("id, inscripciones(id, estado)")
    .eq("curso_id", cursoId);

  if (catError) {
    return { error: catError.message };
  }

  const activas = (catedras ?? []).flatMap((c) => c.inscripciones ?? []).filter(
    (i) => i.estado === "activa" || i.estado === "pendiente"
  );

  if (activas.length > 0) {
    return {
      error: `No se puede eliminar el curso porque tiene ${activas.length} matrícula(s) activa(s) o pendiente(s). Debe dar de baja o finalizar las matrículas antes de borrar el curso.`,
    };
  }

  await supabase.from("curso_habilidades").delete().eq("curso_id", cursoId);
  await supabase.from("programa_curso").delete().eq("curso_id", cursoId);

  const { data: modulos } = await supabase
    .from("curso_modulos")
    .select("id")
    .eq("curso_id", cursoId);

  if (modulos && modulos.length > 0) {
    const modIds = modulos.map((m) => m.id);
    await supabase.from("curso_lecciones").delete().in("modulo_id", modIds);
    await supabase.from("curso_modulos").delete().eq("curso_id", cursoId);
  }

  if (catedras && catedras.length > 0) {
    const catIds = catedras.map((c) => c.id);
    await supabase.from("sesiones").delete().in("catedra_id", catIds);
    await supabase.from("catedra_horarios").delete().in("catedra_id", catIds);
    await supabase.from("catedras").delete().eq("curso_id", cursoId);
  }

  const { error: deleteError } = await supabase.from("cursos").delete().eq("id", cursoId);
  if (deleteError) {
    return { error: deleteError.message };
  }

  return { error: null };
}
