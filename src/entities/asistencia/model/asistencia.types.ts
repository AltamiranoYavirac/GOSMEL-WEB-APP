import type { Database } from "@/shared/api/supabase/database.types";

export type TEstadoAsistencia = Database["public"]["Enums"]["estado_asistencia"];

export interface IAsistenciaEstudianteItem {
  inscripcionId: string;
  estudianteId: string;
  estudianteNombre: string;
  estado: TEstadoAsistencia;
  observacion: string | null;
}

export interface ISesionAsistenciasData {
  sesionId: string;
  catedraId: string;
  codigo: string;
  curso: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  tema: string | null;
  estudiantes: IAsistenciaEstudianteItem[];
}

export interface IGuardarAsistenciaPayload {
  inscripcionId: string;
  estado: TEstadoAsistencia;
  observacion?: string | null;
}
