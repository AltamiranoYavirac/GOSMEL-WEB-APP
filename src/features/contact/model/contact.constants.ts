import { SOCIAL_LINKS } from "@/shared/config";

export const CONTACT_DETAILS = {
  address: "Av. América E5-30 y Av. Pérez Guerrero",
  addressDetail: "Quito — Ecuador",
  phone: "+593 98 602 3191",
  email: "andymelabur@gmail.com",
  mapLabel: "GOSMEL Academia Musical · Quito",
  lat: -0.1985,
  lng: -78.5038,
} as const;

export const CONTACT_WHATSAPP_HREF =
  SOCIAL_LINKS.find((link) => link.label === "WhatsApp")?.href ?? "";

export const CONTACT_SOCIAL_LINKS = SOCIAL_LINKS.filter((link) =>
  ["Instagram", "Facebook"].includes(link.label),
);
