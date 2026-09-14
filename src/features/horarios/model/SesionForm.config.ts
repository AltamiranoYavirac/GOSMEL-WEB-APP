import { z } from "zod";

import { toLocalDateString } from "@/shared/lib";

import type { TEstadoSesion } from "./horario.types";

export const sesionFormSchema = z.object({
  catedraId: z.string().min(1, "Debe seleccionar una cátedra"),
  fecha: z.string().min(10, "Fecha requerida"),
  horaInicio: z.string().min(4, "Hora de inicio requerida"),
  horaFin: z.string().min(4, "Hora de fin requerida"),
  tema: z.string().optional(),
  estado: z.enum(["programada", "realizada", "cancelada", "reprogramada"]).default("programada"),
});

export type ISesionFormValues = z.infer<typeof sesionFormSchema>;

export function getSesionFormDefaults(initial?: Partial<ISesionFormValues>): ISesionFormValues {
  const hoy = toLocalDateString();
  return {
    catedraId: initial?.catedraId ?? "",
    fecha: initial?.fecha ?? hoy,
    horaInicio: initial?.horaInicio ?? "15:00",
    horaFin: initial?.horaFin ?? "16:30",
    tema: initial?.tema ?? "",
    estado: (initial?.estado as TEstadoSesion) ?? "programada",
  };
}

export const ESTADO_SESION_OPCIONES = [
  { value: "programada", label: "Programada" },
  { value: "realizada", label: "Realizada" },
  { value: "reprogramada", label: "Reprogramada" },
  { value: "cancelada", label: "Cancelada" },
];
