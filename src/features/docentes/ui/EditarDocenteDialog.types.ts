import type { IDocenteRow } from "../model/docente.types";

export interface IEditarDocenteDialogProps {
  docente: IDocenteRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}
