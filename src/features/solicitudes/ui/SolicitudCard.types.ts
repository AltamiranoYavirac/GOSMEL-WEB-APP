import type { ISolicitudRow } from "../model/solicitud.types";

export interface ISolicitudCardProps {
  solicitud: ISolicitudRow;
  expanded: boolean;
  onToggle: () => void;
  onMarkNext: () => void;
  onReopen: () => void;
  onRequestDiscard: () => void;
  waUrl: string | null;
  busy: boolean;
}
