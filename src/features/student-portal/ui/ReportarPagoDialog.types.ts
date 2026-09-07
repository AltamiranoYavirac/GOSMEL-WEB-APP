import type { IContactoInstitucional, IStudentCuotaEstado } from "../model/student-dashboard.types";

export interface IReportarPagoDialogProps {
  estudianteId: string;
  cuota: IStudentCuotaEstado | null;
  contacto: IContactoInstitucional;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}