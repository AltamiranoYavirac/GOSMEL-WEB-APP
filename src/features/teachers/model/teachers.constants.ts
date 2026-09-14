import type { TTipoPortafolio } from "./teachers.types";

export const RED_SOCIAL: Record<string, { label: string; icon: string }> = {
  instagram: { label: "Instagram", icon: "ph:instagram-logo" },
  facebook: { label: "Facebook", icon: "ph:facebook-logo" },
  youtube: { label: "YouTube", icon: "ph:youtube-logo" },
  linkedin: { label: "LinkedIn", icon: "ph:linkedin-logo" },
};

export const PORTAFOLIO_TIPO_LABEL: Record<TTipoPortafolio, string> = {
  imagen: "Imagen",
  video: "Video",
  audio: "Audio",
};
