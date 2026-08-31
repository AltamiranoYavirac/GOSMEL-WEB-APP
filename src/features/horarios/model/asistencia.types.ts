export type TEstadoAsistencia = "presente" | "ausente" | "justificado" | "atraso";

export interface IAsistenciaEstudianteItem {
  inscripcionId: string;
  estudianteId: string;
  estudiante: string;
  estado: TEstadoAsistencia;
  observacion: string | null;
}

export interface ISesionAsistenciasData {
  sesionId: string;
  catedraId: string;
  codigo: string;
  curso: string;
  fecha: string;
  tema: string | null;
  estudiantes: IAsistenciaEstudianteItem[];
}
