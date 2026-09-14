import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function eliminarCurso(
  cursoId: string
): Promise<{ data: { publicIds: string[] } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { data: curso, error: cursoError } = await supabase
    .from("cursos")
    .select("portada_public_id, galeria_medios(public_id)")
    .eq("id", cursoId)
    .maybeSingle();

  if (cursoError || !curso) return { data: null, error: cursoError?.message ?? "No se encontró el curso." };

  const { data: catedras, error: catError } = await supabase
    .from("catedras")
    .select("id, inscripciones(id, estado)")
    .eq("curso_id", cursoId);

  if (catError) return { data: null, error: catError.message };

  const activas = (catedras ?? []).flatMap((catedra) => catedra.inscripciones ?? []).filter(
    (inscripcion) => inscripcion.estado === "activa" || inscripcion.estado === "pendiente"
  );

  if (activas.length > 0) {
    return {
      data: null,
      error: `No se puede eliminar el curso porque tiene ${activas.length} matrícula(s) activa(s) o pendiente(s).`,
    };
  }

  await supabase.from("curso_habilidades").delete().eq("curso_id", cursoId);
  await supabase.from("programa_curso").delete().eq("curso_id", cursoId);

  const { data: modulos } = await supabase.from("curso_modulos").select("id").eq("curso_id", cursoId);
  if (modulos?.length) {
    await supabase.from("curso_lecciones").delete().in("modulo_id", modulos.map((modulo) => modulo.id));
    await supabase.from("curso_modulos").delete().eq("curso_id", cursoId);
  }

  if (catedras?.length) {
    const ids = catedras.map((catedra) => catedra.id);
    await supabase.from("sesiones").delete().in("catedra_id", ids);
    await supabase.from("catedra_horarios").delete().in("catedra_id", ids);
    await supabase.from("catedras").delete().eq("curso_id", cursoId);
  }

  const { error } = await supabase.from("cursos").delete().eq("id", cursoId);
  if (error) return { data: null, error: error.message };

  const publicIds = [
    curso.portada_public_id,
    ...(curso.galeria_medios ?? []).map((medio) => medio.public_id),
  ].filter((publicId): publicId is string => Boolean(publicId));

  return { data: { publicIds }, error: null };
}
