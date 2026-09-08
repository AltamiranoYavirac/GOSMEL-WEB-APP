import type { ISolicitudRow } from "../model/solicitud.types";

export interface ICrearMatriculaDialogProps {
  solicitud: ISolicitudRow | null;
  onClose: () => void;
}
