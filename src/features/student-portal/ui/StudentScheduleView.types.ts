import type { IStudentSesion } from "../model/student-dashboard.types";

export interface IStudentScheduleViewProps {
  proximas: IStudentSesion[];
  pasadas: IStudentSesion[];
}