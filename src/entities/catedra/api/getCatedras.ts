import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/api/supabase/database.types";

import type { ICatedraRow, TEstadoCatedra, TModalidadCurso } from "../model/catedra.types";

export async function getCatedras(
  supabase: SupabaseClient<Database> = createSupabaseBrowserClient(),
): Promise<{
  data: ICatedraRow[] | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("catedras")
    .select(
      "id, codigo, aula, cupo_maximo, modalidad, estado, fecha_inicio, fecha_fin, curso_id, cursos(nombre), docente_id, docentes!catedras_docente_id_fkey(perfiles!docentes_perfil_id_fkey(nombres, apellidos)), inscripciones!inscripciones_catedra_id_fkey(estado), catedra_horarios(id)"
    )
    .order("codigo", { ascending: true })
    .limit(300);

  if (error) {
    return { data: null, error: error.message };
  }

  const rows: ICatedraRow[] = (data ?? []).map((catedra) => {
    const inscripciones = catedra.inscripciones ?? [];
    const docente = catedra.docentes?.perfiles;

    return {
      id: catedra.id,
      codigo: catedra.codigo,
      curso: catedra.cursos?.nombre ?? "Sin curso",
      cursoId: catedra.curso_id,
      docente: docente ? `${docente.nombres} ${docente.apellidos}`.trim() : null,
      docenteId: catedra.docente_id,
      modalidad: catedra.modalidad as TModalidadCurso,
      aula: catedra.aula,
      cupoMaximo: catedra.cupo_maximo,
      fechaInicio: catedra.fecha_inicio,
      fechaFin: catedra.fecha_fin,
      numHorarios: (catedra.catedra_horarios ?? []).length,
      activos: inscripciones.filter((item) => item.estado === "activa").length,
      pendientes: inscripciones.filter((item) => item.estado === "pendiente").length,
      estado: catedra.estado as TEstadoCatedra,
    };
  });

  return { data: rows, error: null };
}