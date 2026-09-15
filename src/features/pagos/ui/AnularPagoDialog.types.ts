import type { ReactNode } from "react";

import type { IPagoRow } from "../model/pago.types";

export interface IAnularPagoDialogProps {
  pago: IPagoRow;
  trigger?: ReactNode;
}
