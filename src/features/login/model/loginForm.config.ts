import { z } from "zod"

export const loginFormSchema = z.object({
  email: z.string().email("Ingresa un correo electrónico válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  rememberMe: z.boolean().default(false),
})

export type ILoginFormValues = z.infer<typeof loginFormSchema>

export function getLoginFormDefaults(): ILoginFormValues {
  return { email: "", password: "", rememberMe: false }
}
