import type { IAsignacionDocente, IAsignacionRow } from "../model/asignacion.types";

export interface IReasignarDocenteDialogProps {
  catedras: IAsignacionRow[];
  docentes: IAsignacionDocente[];
  docenteSugerido?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}
