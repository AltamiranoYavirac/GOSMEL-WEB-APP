import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IHorarioFormValues } from "../model/HorarioForm.config";

export async function crearHorarioRecurrente(
  values: IHorarioFormValues
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("catedra_horarios")
    .insert({
      catedra_id: values.catedraId,
      dia_semana: Number(values.diaSemana),
      hora_inicio: values.horaInicio.length === 5 ? `${values.horaInicio}:00` : values.horaInicio,
      hora_fin: values.horaFin.length === 5 ? `${values.horaFin}:00` : values.horaFin,
    })
    .select("id")
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}
