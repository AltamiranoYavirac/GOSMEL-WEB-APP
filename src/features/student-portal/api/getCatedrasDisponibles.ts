import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { ICatedraDisponible, TModalidadCurso, TEstadoCatedra, TNivelCurso } from "../model/student-dashboard.types";

export async function getCatedrasDisponibles(estudianteId?: string | null): Promise<{
  data: ICatedraDisponible[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();

  const [catedrasRes, inscripcionesRes] = await Promise.all([
    supabase
      .from("catedras")
      .select("id, codigo, aula, modalidad, estado, cursos(id, nombre, nivel, precio_referencial)")
      .in("estado", ["planificada", "en_curso"])
      .order("codigo", { ascending: true })
      .limit(300),
    estudianteId
      ? supabase
          .from("inscripciones")
          .select("catedra_id")
          .eq("estudiante_id", estudianteId)
          .in("estado", ["activa", "pendiente"])
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (catedrasRes.error) {
    return { data: null, error: catedrasRes.error.message };
  }

  const excluidas = new Set((inscripcionesRes.data ?? []).map((i) => i.catedra_id));

  const rows: ICatedraDisponible[] = (catedrasRes.data ?? [])
    .filter((catedra) => !excluidas.has(catedra.id))
    .map((catedra) => ({
      id: catedra.id,
      codigo: catedra.codigo,
      curso: catedra.cursos?.nombre ?? "Curso",
      nivel: (catedra.cursos?.nivel ?? null) as TNivelCurso | null,
      precioReferencial:
        catedra.cursos?.precio_referencial != null ? Number(catedra.cursos.precio_referencial) : null,
      modalidad: catedra.modalidad as TModalidadCurso,
      aula: catedra.aula,
      estado: catedra.estado as TEstadoCatedra,
    }));

  return { data: rows, error: null };
}