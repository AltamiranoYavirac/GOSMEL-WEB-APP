import type { IRepresentanteRow } from "../model/representante.types";

export interface IEditarRepresentanteDialogProps {
  representante: IRepresentanteRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
