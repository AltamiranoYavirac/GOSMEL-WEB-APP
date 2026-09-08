import type { TAccentTone } from "./dashboard-overview.types";

export const ACCENT_TONE_TILE: Record<TAccentTone, string> = {
  info: "bg-info-tint text-info-fg",
  warning: "bg-warning-tint text-warning-fg",
  success: "bg-success-tint text-success-fg",
  danger: "bg-danger-tint text-danger-fg",
  neutral: "bg-foreground/6 text-foreground",
};

export const ACCENT_TONE_SPARK: Record<TAccentTone, string> = {
  info: "text-info-fg",
  warning: "text-warning-fg",
  success: "text-success-fg",
  danger: "text-danger-fg",
  neutral: "text-muted-foreground",
};

export const ACCENT_TONE_BORDER: Record<TAccentTone, string> = {
  info: "border-info-border",
  warning: "border-warning-border",
  success: "border-success-border",
  danger: "border-danger-border",
  neutral: "border-border",
};

export const ACCENT_TONE_DOT: Record<TAccentTone, string> = {
  info: "bg-info",
  warning: "bg-warning",
  success: "bg-success",
  danger: "bg-danger",
  neutral: "bg-muted-foreground",
};

export const ACCENT_TONE_AVATAR: Record<TAccentTone, string> = {
  info: "bg-info-tint text-info-fg",
  warning: "bg-warning-tint text-warning-fg",
  success: "bg-success-tint text-success-fg",
  danger: "bg-danger-tint text-danger-fg",
  neutral: "bg-foreground/8 text-foreground",
};

export const ACCENT_TONE_BADGE: Record<TAccentTone, string> = {
  info: "bg-info-tint text-info-fg",
  warning: "bg-warning-tint text-warning-fg",
  success: "bg-success-tint text-success-fg",
  danger: "bg-danger-tint text-danger-fg",
  neutral: "bg-foreground/8 text-foreground",
};
