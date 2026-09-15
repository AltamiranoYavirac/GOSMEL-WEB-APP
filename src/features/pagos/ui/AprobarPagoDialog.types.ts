import type { ReactNode } from "react";

import type { IPagoRow } from "../model/pago.types";

export interface IAprobarPagoDialogProps {
  pago: IPagoRow;
  trigger?: ReactNode;
}
