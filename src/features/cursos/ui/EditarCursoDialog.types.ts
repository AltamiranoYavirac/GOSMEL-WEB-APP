import type { ICursoRow } from "../model/curso.types";

export interface IEditarCursoDialogProps {
  curso: ICursoRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}
