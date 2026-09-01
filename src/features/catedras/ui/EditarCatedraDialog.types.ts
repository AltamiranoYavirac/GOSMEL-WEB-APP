import type { ICatedraRow } from "../model/catedra.types";

export interface IEditarCatedraDialogProps {
  catedra: ICatedraRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}
