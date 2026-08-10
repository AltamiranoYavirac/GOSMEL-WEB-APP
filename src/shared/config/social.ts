export interface ISocialProvider {
  id: string;
  icon: string;
  label: string;
}

export const SOCIAL_PROVIDERS: ISocialProvider[] = [
  { id: "google", icon: "mdi:google", label: "Google" },
  { id: "facebook", icon: "mdi:facebook", label: "Facebook" },
  { id: "apple", icon: "mdi:apple", label: "Apple" },
];
