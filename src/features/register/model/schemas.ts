import { z } from "zod";

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z
    .string()
    .email("Ingresa un correo electrónico válido"),
  phone: z
    .string()
    .regex(
      /^\+?[1-9]\d{7,14}$/,
      "Ingresa un número de celular válido"
    ),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
});