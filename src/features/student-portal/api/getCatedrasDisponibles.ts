import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { ICatedraDisponible, TModalidadCurso, TEstadoCatedra } from "../model/student-dashboard.types";

export async function getCatedrasDisponibles(): Promise<{
  data: ICatedraDisponible[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("catedras")
    .select("id, codigo, aula, modalidad, estado, cursos(nombre)")
    .in("estado", ["planificada", "en_curso"])
    .order("codigo", { ascending: true })
    .limit(300);

  if (error) {
    return { data: null, error: error.message };
  }

  const rows: ICatedraDisponible[] = (data ?? []).map((catedra) => ({
    id: catedra.id,
    codigo: catedra.codigo,
    curso: catedra.cursos?.nombre ?? "Curso",
    modalidad: catedra.modalidad as TModalidadCurso,
    aula: catedra.aula,
    estado: catedra.estado as TEstadoCatedra,
  }));

  return { data: rows, error: null };
}