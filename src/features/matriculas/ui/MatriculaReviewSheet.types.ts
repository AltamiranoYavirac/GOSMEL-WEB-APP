import type { IInscripcionPendiente } from "@/entities/matricula";

export interface IMatriculaReviewSheetProps {
  inscripcion: IInscripcionPendiente | null;
  onClose: () => void;
  onAprobar: (inscripcion: IInscripcionPendiente) => void;
  onRechazar: (inscripcion: IInscripcionPendiente) => void;
}
