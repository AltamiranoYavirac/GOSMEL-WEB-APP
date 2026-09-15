import { z } from "zod";

export const PARENTESCO_REPRESENTANTE_OPCIONES = [
  { value: "madre", label: "Madre" }, { value: "padre", label: "Padre" }, { value: "abuelo", label: "Abuelo/a" },
  { value: "tio", label: "Tío/a" }, { value: "hermano", label: "Hermano/a" }, { value: "tutor_legal", label: "Tutor legal" }, { value: "otro", label: "Otro" },
] as const;

export const vincularRepresentanteFormSchema = z.object({
  representanteId: z.string().uuid("Selecciona un representante"),
  parentesco: z.enum(["madre", "padre", "abuelo", "tio", "hermano", "tutor_legal", "otro"]),
  esContactoPrincipal: z.boolean(),
  autorizaRetiro: z.boolean(),
});
export type IVincularRepresentanteFormValues = z.infer<typeof vincularRepresentanteFormSchema>;
export function getVincularRepresentanteFormDefaults(): IVincularRepresentanteFormValues { return { representanteId: "", parentesco: "tutor_legal", esContactoPrincipal: false, autorizaRetiro: true }; }
