import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import { toLocalDateString } from "@/shared/lib/date";

import type { IStudentPractice, IStudentPracticeLog } from "../model/student-dashboard.types";

function fechaKey(date: Date): string {
  return toLocalDateString(date);
}

export async function getStudentPracticeLogs(estudianteId: string): Promise<{
  data: IStudentPractice | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("registros_practica")
    .select("id, fecha, minutos, nota, inscripcion_id, inscripciones!registros_practica_inscripcion_id_fkey(catedras!inscripciones_catedra_id_fkey(codigo))")
    .eq("estudiante_id", estudianteId)
    .order("fecha", { ascending: false })
    .limit(200);

  if (error) {
    return { data: null, error: error.message };
  }

  const logs: IStudentPracticeLog[] = (data ?? []).map((row) => ({
    id: row.id,
    fecha: row.fecha,
    minutos: row.minutos,
    nota: row.nota,
    catedra: row.inscripciones?.catedras?.codigo ?? null,
  }));

  const conPractica = new Set(logs.map((log) => log.fecha));

  let rachaDias = 0;
  const inicio = new Date();
  if (!conPractica.has(fechaKey(inicio))) {
    inicio.setDate(inicio.getDate() - 1);
  }
  while (conPractica.has(fechaKey(inicio))) {
    rachaDias += 1;
    inicio.setDate(inicio.getDate() - 1);
  }

  const semana: { dia: string; minutos: number }[] = [];
  for (let index = 6; index >= 0; index -= 1) {
    const dia = new Date();
    dia.setDate(dia.getDate() - index);
    const key = fechaKey(dia);
    const minutos = logs.filter((log) => log.fecha === key).reduce((acc, log) => acc + log.minutos, 0);
    semana.push({ dia: key, minutos });
  }

  return { data: { logs, rachaDias, semana }, error: null };
}