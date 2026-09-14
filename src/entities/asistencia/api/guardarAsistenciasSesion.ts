import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IGuardarAsistenciaPayload } from "../model/asistencia.types";

export async function guardarAsistenciasSesion(
  sesionId: string,
  asistencias: IGuardarAsistenciaPayload[],
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const records = asistencias.map((item) => ({
    sesion_id: sesionId,
    inscripcion_id: item.inscripcionId,
    estado: item.estado,
    observacion: item.observacion?.trim() || null,
    registrada_en: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from("asistencias")
    .upsert(records, { onConflict: "inscripcion_id,sesion_id" });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
