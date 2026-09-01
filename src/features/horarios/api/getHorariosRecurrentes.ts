import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IHorarioRecurrenteRow } from "../model/horario.types";

export async function getHorariosRecurrentes(): Promise<{
  data: IHorarioRecurrenteRow[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("catedra_horarios")
    .select("id, dia_semana, hora_inicio, hora_fin, catedra_id, catedras(codigo, cursos(nombre))")
    .order("dia_semana", { ascending: true })
    .order("hora_inicio", { ascending: true })
    .limit(300);

  if (error) {
    return { data: null, error: error.message };
  }

  const rows: IHorarioRecurrenteRow[] = (data ?? []).map((horario) => ({
    id: horario.id,
    catedra: horario.catedras?.codigo ?? "Sin cátedra",
    curso: horario.catedras?.cursos?.nombre ?? "—",
    diaSemana: horario.dia_semana,
    horaInicio: horario.hora_inicio,
    horaFin: horario.hora_fin,
  }));

  return { data: rows, error: null };
}