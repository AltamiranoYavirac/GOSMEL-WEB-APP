import { z } from "zod"

export const datosRepresentanteFormSchema = z.object({
  direccion: z.string().trim().max(200, "Máximo 200 caracteres").optional(),
  ocupacion: z.string().trim().max(100, "Máximo 100 caracteres").optional(),
})

export type IDatosRepresentanteFormValues = z.infer<typeof datosRepresentanteFormSchema>

export function getDatosRepresentanteFormDefaults(): IDatosRepresentanteFormValues {
  return { direccion: "", ocupacion: "" }
}

export function mapMiRepresentanteToFormValues(representante: {
  direccion: string | null
  ocupacion: string | null
}): IDatosRepresentanteFormValues {
  return {
    direccion: representante.direccion ?? "",
    ocupacion: representante.ocupacion ?? "",
  }
}

export function buildDatosRepresentantePayload(values: IDatosRepresentanteFormValues) {
  return {
    direccion: values.direccion?.trim() || null,
    ocupacion: values.ocupacion?.trim() || null,
  }
}
