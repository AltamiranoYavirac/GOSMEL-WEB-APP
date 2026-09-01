import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { ICatedraRow, TEstadoCatedra, TModalidadCurso } from "../model/catedra.types";

export async function getCatedras(): Promise<{
  data: ICatedraRow[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("catedras")
    .select(
      "id, codigo, aula, cupo_maximo, modalidad, estado, curso_id, cursos(nombre), docente_id, docentes!catedras_docente_id_fkey(perfiles!docentes_perfil_id_fkey(nombres, apellidos)), inscripciones!inscripciones_catedra_id_fkey(estado)"
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
      docente: docente ? `${docente.nombres} ${docente.apellidos}`.trim() : null,
      modalidad: catedra.modalidad as TModalidadCurso,
      aula: catedra.aula,
      cupoMaximo: catedra.cupo_maximo,
      activos: inscripciones.filter((item) => item.estado === "activa").length,
      pendientes: inscripciones.filter((item) => item.estado === "pendiente").length,
      estado: catedra.estado as TEstadoCatedra,
    };
  });

  return { data: rows, error: null };
}