import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IRegistrarPracticaFormValues } from "../model/RegistrarPracticaForm.config";

export async function createPracticeLog(
  estudianteId: string,
  values: IRegistrarPracticaFormValues
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const { data, error } = await supabase
    .from("registros_practica")
    .insert({
      estudiante_id: estudianteId,
      inscripcion_id: values.inscripcionId || null,
      fecha: values.fecha,
      minutos: values.minutos,
      nota: values.nota?.trim() || null,
    })
    .select("id")
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}