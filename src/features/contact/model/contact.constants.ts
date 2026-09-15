import { SOCIAL_LINKS, type ISocialLink } from "@/shared/config";
import type { Json } from "@/shared/api/supabase/database.types";

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

const SOCIAL_NETWORK_META: Record<string, { icon: string; label: string }> = {
  instagram: { icon: "mdi:instagram", label: "Instagram" },
  facebook: { icon: "mdi:facebook", label: "Facebook" },
  tiktok: { icon: "simple-icons:tiktok", label: "TikTok" },
  youtube: { icon: "mdi:youtube", label: "YouTube" },
};

export function resolveSocialLinks(redesSociales: Json | null | undefined): ISocialLink[] {
  if (redesSociales && typeof redesSociales === "object" && !Array.isArray(redesSociales)) {
    const links = Object.entries(redesSociales as Record<string, unknown>)
      .filter((entry): entry is [string, string] => typeof entry[1] === "string" && entry[1].trim() !== "" && entry[0] in SOCIAL_NETWORK_META)
      .map(([network, href]) => ({ href, ...SOCIAL_NETWORK_META[network] }));

    if (links.length > 0) return links;
  }

  return CONTACT_SOCIAL_LINKS;
}
