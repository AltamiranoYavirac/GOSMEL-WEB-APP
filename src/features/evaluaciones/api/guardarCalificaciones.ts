import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export interface IGuardarCalificacionItem {
  inscripcionId: string;
  nota: number | null;
  observacion?: string | null;
}

export async function guardarCalificaciones(
  evaluacionId: string,
  calificaciones: IGuardarCalificacionItem[]
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { data: { user } } = await supabase.auth.getUser();

  const records = calificaciones
    .filter((item) => item.nota !== null && !Number.isNaN(item.nota))
    .map((item) => ({
      evaluacion_id: evaluacionId,
      inscripcion_id: item.inscripcionId,
      nota: item.nota,
      observacion: item.observacion?.trim() || null,
      calificada_por: user?.id ?? null,
      calificada_en: new Date().toISOString(),
    }));

  if (records.length === 0) {
    return { error: null };
  }

  const { error } = await supabase
    .from("calificaciones")
    .upsert(records, { onConflict: "evaluacion_id,inscripcion_id" });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
