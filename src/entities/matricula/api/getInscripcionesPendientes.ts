import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/api/supabase/database.types";

import type { IInscripcionPendiente } from "../model/matricula.types";

export async function getInscripcionesPendientes(
  catedraId?: string,
  supabase: SupabaseClient<Database> = createSupabaseBrowserClient(),
): Promise<{ data: IInscripcionPendiente[] | null; error: string | null }> {

  let query = supabase
    .from("inscripciones")
    .select(
      "id, fecha_inscripcion, fecha_inicio, solicitada_por, estudiantes(nombres, apellidos), catedras(codigo, cursos(nombre))"
    )
    .eq("estado", "pendiente")
    .order("fecha_inscripcion", { ascending: true })
    .limit(50);

  if (catedraId) {
    query = query.eq("catedra_id", catedraId);
  }

  const { data, error } = await query;

  if (error) {
    return { data: null, error: error.message };
  }

  const rows: IInscripcionPendiente[] = (data ?? []).map((inscripcion) => ({
    id: inscripcion.id,
    fechaInscripcion: inscripcion.fecha_inscripcion,
    fechaInicio: inscripcion.fecha_inicio,
    estudiante: `${inscripcion.estudiantes?.nombres ?? ""} ${inscripcion.estudiantes?.apellidos ?? ""}`.trim(),
    catedraCodigo: inscripcion.catedras?.codigo ?? null,
    cursoNombre: inscripcion.catedras?.cursos?.nombre ?? null,
    desdeSolicitud: Boolean(inscripcion.solicitada_por),
  }));

  return { data: rows, error: null };
}
