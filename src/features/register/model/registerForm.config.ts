import { z } from "zod"

export const registerFormSchema = z.object({
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z.string().email("Ingresa un correo electrónico válido"),
  phone: z.string().regex(
    /^\+?[1-9]\d{7,14}$/,
    "Ingresa un número de celular válido"
  ),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  acceptTerms: z.boolean().refine((value) => value, {
    message: "Debes aceptar los términos y condiciones",
  }),
})

export type IRegisterFormValues = z.infer<typeof registerFormSchema>

export function getRegisterFormDefaults(): IRegisterFormValues {
  return {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    acceptTerms: false,
  }
}
