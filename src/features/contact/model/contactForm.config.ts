import { z } from "zod"

export type TInstrumentOption = {
  label: string
  value: string
}

export const contactFormSchema = z.object({
  fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Ingresa un correo electrónico válido"),
  instrument: z.string().min(1, "Selecciona un instrumento"),
  message: z
    .string()
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .max(1000, "Máximo 1000 caracteres"),
})

export type IContactFormValues = z.infer<typeof contactFormSchema>

export function getContactFormDefaults(): IContactFormValues {
  return {
    fullName: "",
    email: "",
    instrument: "",
    message: "",
  }
}
