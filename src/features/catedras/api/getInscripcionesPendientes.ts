import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export interface IInscripcionPendiente {
  id: string;
  fechaInscripcion: string;
  estudiante: string;
}

export async function getInscripcionesPendientes(
  catedraId: string
): Promise<{ data: IInscripcionPendiente[] | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("inscripciones")
    .select("id, fecha_inscripcion, estudiantes(nombres, apellidos)")
    .eq("catedra_id", catedraId)
    .eq("estado", "pendiente")
    .order("fecha_inscripcion", { ascending: true })
    .limit(50);

  if (error) {
    return { data: null, error: error.message };
  }

  const rows: IInscripcionPendiente[] = (data ?? []).map((inscripcion) => ({
    id: inscripcion.id,
    fechaInscripcion: inscripcion.fecha_inscripcion,
    estudiante: `${inscripcion.estudiantes?.nombres ?? ""} ${inscripcion.estudiantes?.apellidos ?? ""}`.trim(),
  }));

  return { data: rows, error: null };
}