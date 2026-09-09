import type { ICuotaPendienteItem } from "../api/getCuotasPendientesFamilia";

export interface ISeleccionCuotasProps {
  cuotas: ICuotaPendienteItem[];
  metodo: string;
  referencia: string;
  observacion: string;
  onMetodoChange: (value: string) => void;
  onReferenciaChange: (value: string) => void;
  onObservacionChange: (value: string) => void;
  onSubmit: (pagos: Array<{ cuotaId: string; monto: number }>) => void;
  isSubmitting: boolean;
}
