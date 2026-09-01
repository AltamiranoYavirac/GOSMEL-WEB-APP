import type { ICatedraRow } from "../model/catedra.types";

export interface IGenerarSesionesCatedraDialogProps {
  catedra: ICatedraRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}
