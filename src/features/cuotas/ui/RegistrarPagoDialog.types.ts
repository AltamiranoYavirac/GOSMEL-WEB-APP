export interface IRegistrarPagoDialogProps {
  cuota: {
    id: string;
    estudiante: string;
    saldo: number;
    monto?: number;
    periodo?: string;
  };
}
