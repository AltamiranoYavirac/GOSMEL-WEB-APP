import type { ITeacherInstrumentoItem } from "../model/teacher-dashboard.types";

export interface IGestionarInstrumentosDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instrumentosActuales: ITeacherInstrumentoItem[];
}
