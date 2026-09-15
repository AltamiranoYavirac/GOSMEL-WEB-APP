import type { ISolicitudRow } from "../model/solicitud.types";

export interface IDescartarSolicitudDialogProps {
  solicitud: ISolicitudRow | null;
  busy: boolean;
  onConfirm: () => void;
  onClose: () => void;
}
