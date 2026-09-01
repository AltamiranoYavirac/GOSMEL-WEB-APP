import { z } from "zod";

export const horarioFormSchema = z.object({
  catedraId: z.string().min(1, "Debe seleccionar una cátedra"),
  diaSemana: z.string().min(1, "Debe seleccionar un día"),
  horaInicio: z.string().min(4, "Hora de inicio requerida"),
  horaFin: z.string().min(4, "Hora de fin requerida"),
});

export type IHorarioFormValues = z.infer<typeof horarioFormSchema>;

export function getHorarioFormDefaults(): IHorarioFormValues {
  return {
    catedraId: "",
    diaSemana: "1",
    horaInicio: "15:00",
    horaFin: "16:30",
  };
}

export const DIAS_OPCIONES = [
  { value: "0", label: "Domingo" },
  { value: "1", label: "Lunes" },
  { value: "2", label: "Martes" },
  { value: "3", label: "Miércoles" },
  { value: "4", label: "Jueves" },
  { value: "5", label: "Viernes" },
  { value: "6", label: "Sábado" },
];
