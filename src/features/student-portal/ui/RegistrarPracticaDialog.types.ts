import type { IStudentCatedra } from "../model/student-dashboard.types";

export interface IRegistrarPracticaDialogProps {
  estudianteId: string;
  inscripciones: IStudentCatedra[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}