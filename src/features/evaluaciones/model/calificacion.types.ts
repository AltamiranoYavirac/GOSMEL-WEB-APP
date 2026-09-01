import type { TTipoEvaluacion } from "./evaluacion.types";

export type { TTipoEvaluacion };

export interface ICalificacionEstudianteItem {
  inscripcionId: string;
  estudianteId: string;
  estudiante: string;
  nota: number | null;
  observacion: string | null;
  calificadaEn: string | null;
}

export interface IEvaluacionDetalleCalificaciones {
  evaluacionId: string;
  catedraId: string;
  codigo: string;
  curso: string;
  titulo: string;
  tipo: TTipoEvaluacion;
  notaMaxima: number;
  ponderacion: number;
  fecha: string | null;
  estudiantes: ICalificacionEstudianteItem[];
}
