import { z } from "zod";

import { toLocalDateString } from "@/shared/lib";
import type { ISelectFieldOption } from "@/shared/form";

export const MODALIDAD_OPCIONES: ISelectFieldOption[] = [
  { value: "presencial", label: "Presencial" },
  { value: "virtual", label: "Virtual" },
  { value: "hibrido", label: "Híbrido" },
];

export const ESTADO_CATEDRA_OPCIONES: ISelectFieldOption[] = [
  { value: "planificada", label: "Planificada" },
  { value: "en_curso", label: "En curso" },
  { value: "finalizada", label: "Finalizada" },
  { value: "cancelada", label: "Cancelada" },
];

export const DIA_SEMANA_OPCIONES: ISelectFieldOption[] = [
  { value: "1", label: "Lunes" },
  { value: "2", label: "Martes" },
  { value: "3", label: "Miércoles" },
  { value: "4", label: "Jueves" },
  { value: "5", label: "Viernes" },
  { value: "6", label: "Sábado" },
  { value: "0", label: "Domingo" },
];

export const crearCatedraFormSchema = z
  .object({
    codigo: z.string().trim().min(3, "El código debe tener al menos 3 caracteres"),
    cursoId: z.string().min(1, "Selecciona un curso"),
    docenteId: z.string().min(1, "Selecciona un docente"),
    modalidad: z.enum(["presencial", "virtual", "hibrido"]),
    aula: z.string().optional(),
    cupoMaximo: z.coerce.number().int().min(1, "El cupo mínimo es 1").max(200, "Máximo 200"),
    fechaInicio: z.string().min(1, "Selecciona la fecha de inicio"),
    fechaFin: z.string().optional(),
    estado: z.enum(["planificada", "en_curso", "finalizada", "cancelada"]),
    diaSemana: z.enum(["0", "1", "2", "3", "4", "5", "6"]).or(z.literal("")).default(""),
    horaInicio: z.string().optional(),
    horaFin: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.fechaInicio && values.fechaInicio < toLocalDateString()) {
      ctx.addIssue({
        code: "custom",
        path: ["fechaInicio"],
        message: "La fecha de inicio no puede ser anterior a hoy",
      });
    }

    if (values.fechaInicio && values.fechaFin && values.fechaFin < values.fechaInicio) {
      ctx.addIssue({ code: "custom", path: ["fechaFin"], message: "La fecha final debe ser posterior al inicio" });
    }

    const horario = [values.diaSemana, values.horaInicio, values.horaFin];
    const camposHorario = horario.filter(Boolean).length;
    if (camposHorario > 0 && camposHorario < horario.length) {
      for (const [path, value] of [
        ["diaSemana", values.diaSemana],
        ["horaInicio", values.horaInicio],
        ["horaFin", values.horaFin],
      ] as const) {
        if (!value) ctx.addIssue({ code: "custom", path: [path], message: "Completa todo el horario" });
      }
    }
    if (values.horaInicio && values.horaFin && values.horaFin <= values.horaInicio) {
      ctx.addIssue({ code: "custom", path: ["horaFin"], message: "La hora final debe ser posterior al inicio" });
    }
  });

export type ICrearCatedraFormValues = z.infer<typeof crearCatedraFormSchema>;

export function getCrearCatedraFormDefaults(initial?: Partial<ICrearCatedraFormValues>): ICrearCatedraFormValues {
  return {
    codigo: initial?.codigo ?? "",
    cursoId: initial?.cursoId ?? "",
    docenteId: initial?.docenteId ?? "",
    modalidad: initial?.modalidad ?? "presencial",
    aula: initial?.aula ?? "",
    cupoMaximo: initial?.cupoMaximo ?? 15,
    fechaInicio: initial?.fechaInicio ?? "",
    fechaFin: initial?.fechaFin ?? "",
    estado: initial?.estado ?? "planificada",
    diaSemana: initial?.diaSemana ?? "",
    horaInicio: initial?.horaInicio ?? "",
    horaFin: initial?.horaFin ?? "",
  };
}
