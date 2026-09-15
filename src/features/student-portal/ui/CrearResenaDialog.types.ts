import type { IStudentCatedra, IStudentResena } from "../model/student-dashboard.types";

export interface ICrearResenaDialogProps {
  estudianteId: string;
  catedras: IStudentCatedra[];
  resena?: IStudentResena;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}