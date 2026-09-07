import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { TEstadoAsistencia } from "../model/teacher-dashboard.types";

export interface ISesionAsistenciaEstudianteItem {
  inscripcionId: string;
  estudianteId: string;
  estudianteNombre: string;
  estado: TEstadoAsistencia;
  observacion: string | null;
}

export interface ITeacherSesionAsistenciaData {
  sesionId: string;
  catedraId: string;
  catedraCodigo: string;
  cursoNombre: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  tema: string | null;
  estudiantes: ISesionAsistenciaEstudianteItem[];
}

export async function getTeacherSesionAsistencia(
  sesionId: string
): Promise<{ data: ITeacherSesionAsistenciaData | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const { data: sesion, error: sesionError } = await supabase
    .from("sesiones")
    .select("id, catedra_id, fecha, hora_inicio, hora_fin, tema, catedras(codigo, cursos(nombre))")
    .eq("id", sesionId)
    .single();

  if (sesionError) {
    return { data: null, error: sesionError.message };
  }

  const [inscripcionesRes, asistenciasRes] = await Promise.all([
    supabase
      .from("inscripciones")
      .select("id, estudiante_id, estudiantes(id, nombres, apellidos)")
      .eq("catedra_id", sesion.catedra_id)
      .in("estado", ["activa", "pendiente"]),
    supabase
      .from("asistencias")
      .select("inscripcion_id, estado, observacion")
      .eq("sesion_id", sesionId),
  ]);

  if (inscripcionesRes.error) {
    return { data: null, error: inscripcionesRes.error.message };
  }

  const asistenciaMap = new Map(
    (asistenciasRes.data ?? []).map((a) => [
      a.inscripcion_id,
      { estado: a.estado as TEstadoAsistencia, observacion: a.observacion },
    ])
  );

  const estudiantes: ISesionAsistenciaEstudianteItem[] = (inscripcionesRes.data ?? [])
    .map((item) => {
      const prev = asistenciaMap.get(item.id);
      const est = item.estudiantes;
      const nombreCompleto =
        [est?.nombres, est?.apellidos].filter(Boolean).join(" ") || "Estudiante";

      return {
        inscripcionId: item.id,
        estudianteId: item.estudiante_id,
        estudianteNombre: nombreCompleto,
        estado: prev?.estado ?? ("presente" as TEstadoAsistencia),
        observacion: prev?.observacion ?? null,
      };
    })
    .sort((a, b) => a.estudianteNombre.localeCompare(b.estudianteNombre));

  return {
    data: {
      sesionId: sesion.id,
      catedraId: sesion.catedra_id,
      catedraCodigo: sesion.catedras?.codigo ?? "",
      cursoNombre: sesion.catedras?.cursos?.nombre ?? "",
      fecha: sesion.fecha,
      horaInicio: sesion.hora_inicio,
      horaFin: sesion.hora_fin,
      tema: sesion.tema,
      estudiantes,
    },
    error: null,
  };
}
