import { z } from "zod";

export const contactLeadSchema = z.object({
  email: z.email("Ingresa un correo electrónico válido"),
});
