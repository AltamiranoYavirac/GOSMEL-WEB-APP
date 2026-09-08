import { z } from "zod"

import type { ISelectFieldOption } from "@/shared/form"
import type { Database } from "@/shared/api/supabase/database.types"

import type { IEnviarSolicitudPayload } from "../api/enviarSolicitud"

export type TContactTipoSolicitud = Database["public"]["Enums"]["tipo_solicitud"]

export const CONTACT_TIPO_OPCIONES: ISelectFieldOption[] = [
  { value: "contacto_general", label: "Consulta general" },
  { value: "clase_prueba", label: "Reservar clase de prueba" },
  { value: "admision", label: "Información de admisión" },
  { value: "masterclass", label: "Masterclass" },
]

export const contactFormSchema = z.object({
  fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Ingresa un correo electrónico válido"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{7,20}$/, "Ingresa un teléfono válido")
    .optional()
    .or(z.literal("")),
  tipo: z.enum(["contacto_general", "clase_prueba", "admision", "masterclass"]),
  instrumentoId: z.string().uuid().optional().or(z.literal("")),
  message: z
    .string()
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .max(1000, "Máximo 1000 caracteres"),
  consent: z.literal(true, { message: "Debes autorizar el tratamiento de datos" }),
})

export type IContactFormValues = z.infer<typeof contactFormSchema>

export function getContactFormDefaults(): IContactFormValues {
  return {
    fullName: "",
    email: "",
    phone: "",
    tipo: "contacto_general",
    instrumentoId: "",
    message: "",
    consent: false as unknown as true,
  }
}

export function buildContactPayload(
  values: IContactFormValues,
  origenUrl: string
): IEnviarSolicitudPayload {
  return {
    tipo: values.tipo,
    nombre_completo: values.fullName.trim(),
    email: values.email.trim(),
    telefono: values.phone?.trim() || null,
    instrumento_id: values.instrumentoId || null,
    mensaje: values.message.trim(),
    para_menor: false,
    consentimiento_datos: values.consent,
    origen_url: origenUrl,
  }
}
