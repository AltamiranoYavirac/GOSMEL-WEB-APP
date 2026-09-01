import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { ISesionFormValues } from "../model/SesionForm.config";

export async function crearSesion(
  values: ISesionFormValues
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("sesiones")
    .insert({
      catedra_id: values.catedraId,
      fecha: values.fecha,
      hora_inicio: values.horaInicio.length === 5 ? `${values.horaInicio}:00` : values.horaInicio,
      hora_fin: values.horaFin.length === 5 ? `${values.horaFin}:00` : values.horaFin,
      tema: values.tema?.trim() || null,
      estado: values.estado,
    })
    .select("id")
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}
