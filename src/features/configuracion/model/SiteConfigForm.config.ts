import { z } from "zod";

import type { ISiteConfig, ISiteConfigUpdate } from "@/entities/site-config";

const optionalText = z.string().trim().max(100, "Máximo 100 caracteres").optional();
const optionalEmail = z
  .string()
  .trim()
  .max(100, "Máximo 100 caracteres")
  .email("Ingresa un correo válido")
  .optional()
  .or(z.literal(""));
const optionalPhone = z
  .string()
  .trim()
  .regex(/^[0-9]{0,10}$/, "Solo dígitos, máximo 10")
  .optional()
  .or(z.literal(""));
const optionalUrl = z
  .string()
  .trim()
  .max(100, "Máximo 100 caracteres")
  .url("Ingresa una URL válida")
  .optional()
  .or(z.literal(""));

export const siteConfigFormSchema = z.object({
  direccion: optionalText,
  ciudad: optionalText,
  telefono: optionalPhone,
  whatsapp: optionalPhone,
  emailGeneral: optionalEmail,
  emailAdmisiones: optionalEmail,
  horarioAtencion: optionalText,
  mapaEmbed: optionalUrl,
  instagram: optionalUrl,
  facebook: optionalUrl,
  tiktok: optionalUrl,
  youtube: optionalUrl,
});

export type ISiteConfigFormValues = z.infer<typeof siteConfigFormSchema>;

const REDES_CONOCIDAS = ["instagram", "facebook", "tiktok", "youtube"] as const;

function leerRed(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function getSiteConfigFormDefaults(config?: ISiteConfig | null): ISiteConfigFormValues {
  const redes =
    config?.redesSociales && typeof config.redesSociales === "object" && !Array.isArray(config.redesSociales)
      ? (config.redesSociales as Record<string, unknown>)
      : {};

  return {
    direccion: config?.direccion ?? "",
    ciudad: config?.ciudad ?? "",
    telefono: config?.telefono ?? "",
    whatsapp: config?.whatsapp ?? "",
    emailGeneral: config?.emailGeneral ?? "",
    emailAdmisiones: config?.emailAdmisiones ?? "",
    horarioAtencion: config?.horarioAtencion ?? "",
    mapaEmbed: config?.mapaEmbed ?? "",
    instagram: leerRed(redes.instagram),
    facebook: leerRed(redes.facebook),
    tiktok: leerRed(redes.tiktok),
    youtube: leerRed(redes.youtube),
  };
}

export function buildSiteConfigPayload(values: ISiteConfigFormValues): ISiteConfigUpdate {
  const redes: Record<string, string> = {};
  for (const key of REDES_CONOCIDAS) {
    const url = values[key]?.trim();
    if (url) redes[key] = url;
  }

  return {
    ciudad: values.ciudad?.trim() || null,
    direccion: values.direccion?.trim() || null,
    telefono: values.telefono?.trim() || null,
    whatsapp: values.whatsapp?.trim() || null,
    emailGeneral: values.emailGeneral?.trim() || null,
    emailAdmisiones: values.emailAdmisiones?.trim() || null,
    horarioAtencion: values.horarioAtencion?.trim() || null,
    mapaEmbed: values.mapaEmbed?.trim() || null,
    redesSociales: redes,
  };
}
