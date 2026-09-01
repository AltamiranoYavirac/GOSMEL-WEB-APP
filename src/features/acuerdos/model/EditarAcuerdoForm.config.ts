import { z } from "zod";

import type { TEstadoAcuerdo } from "./acuerdo.types";

export const editarAcuerdoFormSchema = z.object({
  montoMensual: z.number().min(0, "El monto no puede ser negativo"),
  diaCobro: z.number().int().min(1).max(28).optional(),
  fechaFin: z.string().optional(),
  estado: z.enum(["vigente", "suspendido", "finalizado"]),
  motivoAjuste: z.string().optional(),
  observaciones: z.string().optional(),
});

export type IEditarAcuerdoFormValues = z.infer<typeof editarAcuerdoFormSchema>;

export function getEditarAcuerdoFormDefaults(initial?: Partial<IEditarAcuerdoFormValues>): IEditarAcuerdoFormValues {
  return {
    montoMensual: initial?.montoMensual ?? 0,
    diaCobro: initial?.diaCobro ?? 5,
    fechaFin: initial?.fechaFin ?? "",
    estado: (initial?.estado as TEstadoAcuerdo) ?? "vigente",
    motivoAjuste: initial?.motivoAjuste ?? "",
    observaciones: initial?.observaciones ?? "",
  };
}

export const ESTADO_ACUERDO_OPCIONES = [
  { value: "vigente", label: "Vigente" },
  { value: "suspendido", label: "Suspendido" },
  { value: "finalizado", label: "Finalizado" },
];
