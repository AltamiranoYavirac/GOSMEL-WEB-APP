import { z } from "zod";

export { ESTADO_CATEDRA_OPCIONES, MODALIDAD_OPCIONES } from "./CrearCatedraForm.config";

export const editarCatedraFormSchema = z
  .object({
    codigo: z.string().trim().min(3, "El código debe tener al menos 3 caracteres"),
    cursoId: z.string().min(1, "Selecciona un curso"),
    docenteId: z.string().min(1, "Selecciona un docente"),
    modalidad: z.enum(["presencial", "virtual", "hibrido"]),
    aula: z.string().optional(),
    cupoMaximo: z.coerce.number().int().min(1, "Ingresa un cupo válido").max(200, "Máximo 200"),
    fechaInicio: z.string().min(1, "Selecciona la fecha de inicio"),
    fechaFin: z.string().optional(),
    estado: z.enum(["planificada", "en_curso", "finalizada", "cancelada"]),
  })
  .superRefine((values, ctx) => {
    if (values.fechaInicio && values.fechaFin && values.fechaFin < values.fechaInicio) {
      ctx.addIssue({ code: "custom", path: ["fechaFin"], message: "La fecha final debe ser posterior al inicio" });
    }
  });

export type IEditarCatedraFormValues = z.infer<typeof editarCatedraFormSchema>;

export function getEditarCatedraFormDefaults(initial?: Partial<IEditarCatedraFormValues>): IEditarCatedraFormValues {
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
  };
}
