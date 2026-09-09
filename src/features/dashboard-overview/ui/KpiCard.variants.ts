import { tv } from "tailwind-variants";

import { ACCENT_TONE_BORDER, ACCENT_TONE_SPARK } from "../model/accent-tone";
import type { TAccentTone } from "../model/dashboard-overview.types";

const TONES: TAccentTone[] = ["info", "warning", "success", "danger", "neutral"];

const toneSlots = Object.fromEntries(
  TONES.map((tone) => [tone, { tile: ACCENT_TONE_SPARK[tone], border: ACCENT_TONE_BORDER[tone] }])
) as Record<TAccentTone, { tile: string; border: string }>;

export const kpiCardVariants = tv({
  slots: {
    base: "group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg",
    tile: "pointer-events-none absolute -right-2 top-1 rotate-6 opacity-15 transition-all duration-300 ease-out group-hover:rotate-12 group-hover:scale-115 group-hover:opacity-25",
  },
  variants: {
    accented: {
      true: "",
      false: { base: "border-border" },
    },
    tone: toneSlots,
  },
  compoundVariants: [
    { accented: true, tone: "info", class: { base: "border-info-border" } },
    { accented: true, tone: "warning", class: { base: "border-warning-border" } },
    { accented: true, tone: "success", class: { base: "border-success-border" } },
    { accented: true, tone: "danger", class: { base: "border-danger-border" } },
    { accented: true, tone: "neutral", class: { base: "border-border" } },
  ],
  defaultVariants: {
    accented: false,
    tone: "neutral",
  },
});
