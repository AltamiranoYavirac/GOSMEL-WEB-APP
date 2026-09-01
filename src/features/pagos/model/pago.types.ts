export interface IPagoRow {
  id: string;
  fechaPago: string;
  estudiante: string;
  periodo: string | null;
  monto: number;
  metodo: string | null;
  referencia: string | null;
  observacion: string | null;
  comprobanteStoragePath: string | null;
}