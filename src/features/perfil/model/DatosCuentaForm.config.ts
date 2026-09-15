import { z } from "zod"

export const datosCuentaFormSchema = z.object({
  nombres: z.string().trim().min(2, "Ingresa los nombres"),
  apellidos: z.string().trim().min(2, "Ingresa los apellidos"),
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
})

export type IDatosCuentaFormValues = z.infer<typeof datosCuentaFormSchema>

export function getDatosCuentaFormDefaults(): IDatosCuentaFormValues {
  return { nombres: "", apellidos: "", cedula: "", celular: "" }
}

export function mapMiPerfilToFormValues(perfil: {
  nombres: string
  apellidos: string
  cedula: string | null
  celular: string | null
}): IDatosCuentaFormValues {
  return {
    nombres: perfil.nombres,
    apellidos: perfil.apellidos,
    cedula: perfil.cedula ?? "",
    celular: perfil.celular ?? "",
  }
}

export function buildDatosCuentaPayload(values: IDatosCuentaFormValues) {
  return {
    nombres: values.nombres.trim(),
    apellidos: values.apellidos.trim(),
    cedula: values.cedula?.trim() || null,
    celular: values.celular?.trim() || null,
  }
}
