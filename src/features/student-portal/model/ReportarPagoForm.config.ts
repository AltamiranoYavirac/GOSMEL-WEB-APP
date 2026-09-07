import { z } from "zod";

import type { ISelectFieldOption } from "@/shared/form";

export const reportarPagoFormSchema = z.object({
  monto: z.coerce.number().positive("Ingresa un monto válido"),
  metodo: z.string().min(1, "Selecciona un método"),
  referencia: z.string().max(100, "Máximo 100 caracteres").optional(),
  comprobanteStoragePath: z.string().optional(),
  observacion: z.string().max(300, "Máximo 300 caracteres").optional(),
});

export type IReportarPagoFormValues = z.infer<typeof reportarPagoFormSchema>;

export function getReportarPagoFormDefaults(saldo: number): IReportarPagoFormValues {
  return {
    monto: saldo,
    metodo: "transferencia",
    referencia: "",
    comprobanteStoragePath: "",
    observacion: "",
  };
}

export const METODO_PAGO_OPCIONES: ISelectFieldOption[] = [
  { value: "transferencia", label: "Transferencia" },
  { value: "deposito", label: "Depósito" },
  { value: "efectivo", label: "Efectivo" },
  { value: "tarjeta", label: "Tarjeta" },
  { value: "punto_de_venta", label: "Punto de venta" },
];