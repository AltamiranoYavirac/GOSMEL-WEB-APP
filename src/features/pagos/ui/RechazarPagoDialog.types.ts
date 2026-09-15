import type { ReactNode } from "react";

import type { IPagoRow } from "../model/pago.types";

export interface IRechazarPagoDialogProps {
  pago: IPagoRow;
  trigger?: ReactNode;
}
