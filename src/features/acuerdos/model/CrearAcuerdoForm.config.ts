import { z } from "zod";

export const crearAcuerdoFormSchema = z.object({
  estudianteId: z.string().min(1, "Selecciona un estudiante"),
  montoMensual: z.coerce.number().positive("Ingresa una mensualidad válida"),
  diaCobro: z.coerce.number().min(1).max(28, "Día entre 1 y 28"),
  fechaInicio: z.string().min(1, "Selecciona la fecha de inicio"),
  fechaFin: z.string().optional(),
  motivoAjuste: z.string().optional(),
  observaciones: z.string().optional(),
});

export type ICrearAcuerdoFormValues = z.infer<typeof crearAcuerdoFormSchema>;

export function getCrearAcuerdoFormDefaults(): ICrearAcuerdoFormValues {
  return {
    estudianteId: "",
    montoMensual: 35,
    diaCobro: 5,
    fechaInicio: new Date().toISOString().slice(0, 10),
    fechaFin: "",
    motivoAjuste: "",
    observaciones: "",
  };
}
