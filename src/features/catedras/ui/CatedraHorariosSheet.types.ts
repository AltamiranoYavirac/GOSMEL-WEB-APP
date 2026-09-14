import type { ICatedraRow } from "../model/catedra.types";

export interface ICatedraHorariosSheetProps {
  catedra: ICatedraRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
