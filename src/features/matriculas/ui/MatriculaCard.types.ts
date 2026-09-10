import type { IInscripcionPendiente } from "@/entities/matricula";

export interface IMatriculaCardProps {
  inscripcion: IInscripcionPendiente;
  expanded: boolean;
  onToggle: () => void;
  onAprobar: () => void;
  onRechazar: () => void;
}
