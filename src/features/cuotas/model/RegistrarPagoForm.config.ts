import { z } from "zod";

import { toLocalDateString } from "@/shared/lib";
import type { ISelectFieldOption } from "@/shared/form";

export const registrarPagoFormSchema = z.object({
  monto: z.coerce.number().positive("Ingresa un monto válido"),
  metodo: z.string().min(1, "Selecciona un método"),
  fechaPago: z.string().min(1, "Selecciona la fecha"),
  referencia: z.string().optional(),
  observacion: z.string().optional(),
});

export type IRegistrarPagoFormValues = z.infer<typeof registrarPagoFormSchema>;

export function getRegistrarPagoFormDefaults(saldo: number): IRegistrarPagoFormValues {
  return {
    monto: saldo,
    metodo: "transferencia",
    fechaPago: toLocalDateString(),
    referencia: "",
    observacion: "",
  };
}

export const METODO_PAGO_OPCIONES: ISelectFieldOption[] = [
  { value: "transferencia", label: "Transferencia" },
  { value: "efectivo", label: "Efectivo" },
  { value: "tarjeta", label: "Tarjeta" },
  { value: "punto_de_venta", label: "Punto de venta" },
  { value: "deposito", label: "Depósito" },
];