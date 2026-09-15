import { z } from "zod";

import type { ISolicitudRow } from "./solicitud.types";

export const solicitudNotasFormSchema = z.object({
  notasInternas: z.string().max(2000, "Máximo 2000 caracteres"),
});

export type ISolicitudNotasFormValues = z.infer<typeof solicitudNotasFormSchema>;

export function mapSolicitudToNotasFormValues(solicitud: ISolicitudRow): ISolicitudNotasFormValues {
  return {
    notasInternas: solicitud.notasInternas ?? "",
  };
}
