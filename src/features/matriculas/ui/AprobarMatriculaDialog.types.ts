import type { IInscripcionPendiente } from "@/entities/matricula";

export interface IAprobarMatriculaDialogProps {
  inscripcion: IInscripcionPendiente | null;
  onClose: () => void;
}
