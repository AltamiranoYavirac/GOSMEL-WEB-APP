export interface ISocialProvider {
  id: string;
  icon: string;
  label: string;
  color?: string;
}

export const SOCIAL_PROVIDERS: ISocialProvider[] = [
  { id: "google", icon: "logos:google-icon", label: "Google" },
  { id: "discord", icon: "mdi:discord", label: "Discord", color: "#5865F2" },
];

export interface ISocialLink {
  href: string;
  icon: string;
  label: string;
}

export const SOCIAL_LINKS: ISocialLink[] = [
  { href: "https://www.facebook.com/profile.php?id=61572503284978", icon: "mdi:facebook", label: "Facebook" },
  { href: "https://www.instagram.com/gosmel_arte", icon: "mdi:instagram", label: "Instagram" },
  { href: "https://www.tiktok.com/@gosmel_arte?is_from_webapp=1&sender_device=pc", icon: "simple-icons:tiktok", label: "TikTok" },
  { href: "https://api.whatsapp.com/message/SCDDJ5TZHMUBN1?autoload=1&app_absent=0", icon: "mdi:whatsapp", label: "WhatsApp" },
];
