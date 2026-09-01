import { tv } from "tailwind-variants";

import { ACCENT_TONE_GLOW, ACCENT_TONE_SPARK, ACCENT_TONE_TILE } from "../model/accent-tone";
import type { TAccentTone } from "../model/dashboard-overview.types";

const TONES: TAccentTone[] = ["primary", "secondary", "accent", "violet", "destructive"];

const toneSlots = Object.fromEntries(
  TONES.map((tone) => [
    tone,
    { tile: ACCENT_TONE_TILE[tone], glow: ACCENT_TONE_GLOW[tone], spark: ACCENT_TONE_SPARK[tone] },
  ])
) as Record<TAccentTone, { tile: string; glow: string; spark: string }>;

export const kpiCardVariants = tv({
  slots: {
    base: "relative h-full overflow-hidden transition-all duration-300",
    glow: "pointer-events-none absolute -right-8 -top-10 size-32 rounded-full blur-2xl transition-opacity dark:opacity-70",
    tile: "",
    spark: "h-9 w-24",
  },
  variants: {
    variant: {
      hero: {
        base: "bg-background border border-white/60 dark:border-white/5 shadow-[-8px_-8px_20px_rgba(255,255,255,0.9),8px_8px_20px_rgba(169,146,125,0.22)] dark:shadow-[-8px_-8px_20px_rgba(255,255,255,0.04),8px_8px_22px_rgba(0,0,0,0.65)] rounded-3xl hover:-translate-y-1 hover:shadow-[-4px_-4px_12px_rgba(255,255,255,0.95),4px_4px_14px_rgba(169,146,125,0.28)] dark:hover:shadow-[-4px_-4px_14px_rgba(255,255,255,0.06),4px_4px_16px_rgba(0,0,0,0.8)]",
      },
      compact: {
        base: "bg-background border border-white/60 dark:border-white/5 shadow-[-4px_-4px_12px_rgba(255,255,255,0.9),4px_4px_12px_rgba(169,146,125,0.2)] dark:shadow-[-4px_-4px_12px_rgba(255,255,255,0.03),4px_4px_14px_rgba(0,0,0,0.6)] rounded-2xl hover:-translate-y-0.5",
      },
    },
    tone: toneSlots,
  },
  defaultVariants: {
    variant: "hero",
    tone: "primary",
  },
});
