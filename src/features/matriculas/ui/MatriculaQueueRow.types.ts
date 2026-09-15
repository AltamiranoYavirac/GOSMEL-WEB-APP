import type { IInscripcionPendiente } from "@/entities/matricula";

export interface IMatriculaQueueRowProps {
  inscripcion: IInscripcionPendiente;
  onSelect: () => void;
}
