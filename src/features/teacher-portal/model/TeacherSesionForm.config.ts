import { z } from "zod";

export const teacherSesionFormSchema = z.object({
  catedraId: z.string().min(1, "Debe seleccionar una cátedra"),
  fecha: z.string().min(1, "Debe ingresar una fecha"),
  horaInicio: z.string().min(1, "Debe ingresar la hora de inicio"),
  horaFin: z.string().min(1, "Debe ingresar la hora de fin"),
  tema: z.string().max(200, "El tema no puede exceder 200 caracteres").optional().or(z.literal("")),
});

export type ITeacherSesionFormValues = z.infer<typeof teacherSesionFormSchema>;

export function getTeacherSesionFormDefaults(defaultCatedraId = ""): ITeacherSesionFormValues {
  return {
    catedraId: defaultCatedraId,
    fecha: new Date().toISOString().slice(0, 10),
    horaInicio: "15:00",
    horaFin: "16:00",
    tema: "",
  };
}

export function buildTeacherSesionPayload(values: ITeacherSesionFormValues) {
  return {
    catedra_id: values.catedraId,
    fecha: values.fecha,
    hora_inicio: values.horaInicio,
    hora_fin: values.horaFin,
    tema: values.tema?.trim() || null,
    estado: "programada" as const,
  };
}
