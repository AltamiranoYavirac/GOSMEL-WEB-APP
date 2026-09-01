import type { ICobranzaRow } from "../model/cobranza.types";

export interface IPagoFamiliarDialogProps {
  representante: ICobranzaRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}
