import type { SupabaseClient } from "@supabase/supabase-js";

import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { Database } from "@/shared/api/supabase/database.types";

import type { ICatedraHorarioItem } from "../model/catedra-horario.types";

export async function getCatedraHorarios(
  catedraId: string,
  supabase: SupabaseClient<Database> = createSupabaseBrowserClient(),
): Promise<{ data: ICatedraHorarioItem[] | null; error: string | null }> {
  const { data, error } = await supabase
    .from("catedra_horarios")
    .select("id, dia_semana, hora_inicio, hora_fin")
    .eq("catedra_id", catedraId)
    .order("dia_semana", { ascending: true })
    .order("hora_inicio", { ascending: true });

  if (error) {
    return { data: null, error: error.message };
  }

  return {
    data: (data ?? []).map((horario) => ({
      id: horario.id,
      diaSemana: horario.dia_semana,
      horaInicio: horario.hora_inicio.slice(0, 5),
      horaFin: horario.hora_fin.slice(0, 5),
    })),
    error: null,
  };
}

export async function agregarHorarioCatedra(input: {
  catedraId: string;
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
}): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("catedra_horarios")
    .insert({
      catedra_id: input.catedraId,
      dia_semana: input.diaSemana,
      hora_inicio: input.horaInicio.length === 5 ? `${input.horaInicio}:00` : input.horaInicio,
      hora_fin: input.horaFin.length === 5 ? `${input.horaFin}:00` : input.horaFin,
    })
    .select("id")
    .single();

  if (error) {
    if (error.message.includes("catedra_horarios_check")) {
      return { data: null, error: "La hora de fin debe ser posterior a la de inicio." };
    }
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function eliminarHorarioCatedra(horarioId: string): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.from("catedra_horarios").delete().eq("id", horarioId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
