import type { TEstadoAsistencia } from "../model/teacher-dashboard.types";

export interface ITomarAsistenciaTeacherDialogProps {
  sesionId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface IAsistenciaOverride {
  estado?: TEstadoAsistencia;
  observacion?: string;
}
