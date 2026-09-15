import { z } from "zod";

import { toLocalDateString } from "@/shared/lib";

export const certificadoFormSchema = z.object({
  inscripcionId: z.string().min(1, "Debe seleccionar un estudiante matriculado"),
  codigoVerificacion: z.string().min(6, "El código debe tener al menos 6 caracteres"),
  fechaEmision: z.string().min(10, "Fecha requerida"),
  storagePath: z.string().optional(),
});

export type ICertificadoFormValues = z.infer<typeof certificadoFormSchema>;

function generarCodigo(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let res = "GOS-";
  for (let i = 0; i < 8; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return res;
}

export function getCertificadoFormDefaults(): ICertificadoFormValues {
  return {
    inscripcionId: "",
    codigoVerificacion: generarCodigo(),
    fechaEmision: toLocalDateString(),
    storagePath: "",
  };
}
