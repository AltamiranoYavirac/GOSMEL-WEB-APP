import type { ICatedraEstudianteItem } from "../model/catedra-estudiantes.types";

export interface ICatedraMatriculadoItemRowProps {
  catedraId: string;
  catedraCodigo: string;
  estudiante: ICatedraEstudianteItem;
}
