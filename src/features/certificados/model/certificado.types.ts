export interface ICertificadoRow {
  id: string;
  inscripcionId: string;
  codigoVerificacion: string;
  fechaEmision: string;
  storagePath: string | null;
  estudiante: string;
  catedra: string;
  curso: string;
  progresoPct: number;
}
