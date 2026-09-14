import type { TEstadoAsistencia } from "../model/asistencia.types";

export interface IAsistenciasEditorProps {
  sesionId: string;
  enabled?: boolean;
  onSaved?: () => void;
}

export interface IAsistenciaOverride {
  estado?: TEstadoAsistencia;
  observacion?: string;
}
