import type { IEstudianteDetalle } from "../model/estudiante-detalle.types";

export interface IEstudianteExpedienteProps {
  estudianteId: string;
}

export interface IExpedienteTabProps {
  estudianteId: string;
  detalle: IEstudianteDetalle;
}
