import { tv } from "tailwind-variants";

import { ACCENT_TONE_BORDER, ACCENT_TONE_TILE } from "../model/accent-tone";
import type { TAccentTone } from "../model/dashboard-overview.types";

const TONES: TAccentTone[] = ["info", "warning", "success", "danger", "neutral"];

const toneSlots = Object.fromEntries(
  TONES.map((tone) => [tone, { tile: ACCENT_TONE_TILE[tone], border: ACCENT_TONE_BORDER[tone] }])
) as Record<TAccentTone, { tile: string; border: string }>;

export const kpiCardVariants = tv({
  slots: {
    base: "flex h-full flex-col gap-3 rounded-[14px] border bg-card p-5",
    tile: "flex size-[34px] shrink-0 items-center justify-center rounded-[9px]",
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
