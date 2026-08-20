import type { TAccentTone } from "./dashboard-overview.types";

export const ACCENT_TONE_TILE: Record<TAccentTone, string> = {
  violet: "bg-violet-tint text-violet-700 dark:text-violet-300",
  primary: "bg-primary-tint text-primary-700 dark:text-primary-300",
  secondary: "bg-secondary-100 text-secondary-800 dark:bg-secondary-950 dark:text-secondary-300",
  accent: "bg-accent-100 text-accent-700 dark:bg-accent-900 dark:text-accent-300",
  destructive: "bg-destructive/10 text-destructive",
};

export const ACCENT_TONE_SPARK: Record<TAccentTone, string> = {
  violet: "text-violet-500 dark:text-violet-400",
  primary: "text-primary-600 dark:text-primary-400",
  secondary: "text-secondary-600 dark:text-secondary-400",
  accent: "text-accent-600 dark:text-accent-400",
  destructive: "text-destructive",
};

export const ACCENT_TONE_GLOW: Record<TAccentTone, string> = {
  violet: "bg-violet-500/15 dark:bg-violet-400/20",
  primary: "bg-primary-500/15 dark:bg-primary-400/20",
  secondary: "bg-secondary-500/20 dark:bg-secondary-400/15",
  accent: "bg-accent-500/20 dark:bg-accent-400/15",
  destructive: "bg-destructive/10",
};

export const ACCENT_TONE_AVATAR: Record<TAccentTone, string> = {
  violet: "from-violet-500 to-violet-700",
  primary: "from-primary-400 to-primary-600",
  secondary: "from-secondary-400 to-secondary-600",
  accent: "from-accent-400 to-accent-600",
  destructive: "from-destructive to-destructive/80",
};

export const ACCENT_TONE_BADGE: Record<TAccentTone, string> = {
  violet: "bg-violet-tint text-violet-700 dark:text-violet-300",
  primary: "bg-primary-tint text-primary-700 dark:text-primary-300",
  secondary: "bg-secondary-100 text-secondary-800 dark:bg-secondary-950 dark:text-secondary-300",
  accent: "bg-accent-100 text-accent-700 dark:bg-accent-900 dark:text-accent-300",
  destructive: "bg-destructive/10 text-destructive",
};
