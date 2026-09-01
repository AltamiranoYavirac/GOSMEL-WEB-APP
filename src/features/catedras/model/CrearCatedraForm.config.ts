import { z } from "zod";

import type { ISelectFieldOption } from "@/shared/form";

export const crearCatedraFormSchema = z.object({
  codigo: z.string().min(3, "El código debe tener al menos 3 caracteres"),
  cursoId: z.string().min(1, "Selecciona un curso"),
  docenteId: z.string().min(1, "Selecciona un docente"),
  modalidad: z.enum(["presencial", "virtual", "hibrido"]),
  aula: z.string().optional(),
  cupoMaximo: z.coerce.number().int().min(0, "Ingresa un cupo válido").max(200, "Máximo 200"),
  fechaInicio: z.string().optional(),
  fechaFin: z.string().optional(),
  estado: z.enum(["planificada", "en_curso", "finalizada", "cancelada"]),
  diaSemana: z.string().optional(),
  horaInicio: z.string().optional(),
  horaFin: z.string().optional(),
});

export type ICrearCatedraFormValues = z.infer<typeof crearCatedraFormSchema>;

export function getCrearCatedraFormDefaults(): ICrearCatedraFormValues {
  return {
    codigo: "",
    cursoId: "",
    docenteId: "",
    modalidad: "presencial",
    aula: "",
    cupoMaximo: 10,
    fechaInicio: "",
    fechaFin: "",
    estado: "planificada",
    diaSemana: "",
    horaInicio: "",
    horaFin: "",
  };
}

export interface ICursoOption {
  id: string;
  nombre: string;
}

export interface IDocenteOption {
  id: string;
  nombre: string;
}

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
  { value: "7", label: "Domingo" },
];