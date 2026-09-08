import type { IInscripcionPendiente } from "@/entities/matricula";

export interface IRechazarMatriculaDialogProps {
  inscripcion: IInscripcionPendiente | null;
  onClose: () => void;
}
