import { z } from "zod"

export const datosEstudianteFormSchema = z.object({
  biografiaCorta: z.string().trim().max(500, "Máximo 500 caracteres").optional(),
})

export type IDatosEstudianteFormValues = z.infer<typeof datosEstudianteFormSchema>

export function getDatosEstudianteFormDefaults(): IDatosEstudianteFormValues {
  return { biografiaCorta: "" }
}

export function mapMiEstudianteToFormValues(estudiante: {
  biografiaCorta: string | null
}): IDatosEstudianteFormValues {
  return { biografiaCorta: estudiante.biografiaCorta ?? "" }
}

export function buildDatosEstudiantePayload(values: IDatosEstudianteFormValues) {
  return { biografia_corta: values.biografiaCorta?.trim() || null }
}
