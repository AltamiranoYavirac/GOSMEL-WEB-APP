import { z } from "zod";

export const editarContactoFormSchema = z.object({
  cedula: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || value.length >= 5, "La cédula debe tener al menos 5 dígitos"),
  celular: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || /^\+?[1-9]\d{6,14}$/.test(value), "Ingresa un teléfono válido"),
});

export type IEditarContactoFormValues = z.infer<typeof editarContactoFormSchema>;

export function getEditarContactoFormDefaults(
  cedula: string | null,
  celular: string | null
): IEditarContactoFormValues {
  return { cedula: cedula ?? "", celular: celular ?? "" };
}