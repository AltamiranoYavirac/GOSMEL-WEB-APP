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
      hero: { base: "group-hover:-translate-y-0.5 group-hover:shadow-lg group-hover:shadow-foreground/5" },
      compact: { base: "" },
    },
    tone: toneSlots,
  },
  defaultVariants: {
    variant: "hero",
    tone: "primary",
  },
});
