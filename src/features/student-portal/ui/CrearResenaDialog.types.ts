import type { IStudentCatedra } from "../model/student-dashboard.types";

export interface ICrearResenaDialogProps {
  estudianteId: string;
  catedras: IStudentCatedra[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}