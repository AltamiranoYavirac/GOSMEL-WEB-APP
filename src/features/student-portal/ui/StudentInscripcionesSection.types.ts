import type { IStudentCatedra } from "../model/student-dashboard.types";

export interface IStudentInscripcionesSectionProps {
  catedras: IStudentCatedra[];
  loading?: boolean;
}