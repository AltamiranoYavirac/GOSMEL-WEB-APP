import { tv } from "tailwind-variants";

import { ACCENT_TONE_BADGE } from "../model/accent-tone";

export const activityBadgeVariants = tv({
  base: "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none",
  variants: {
    tone: ACCENT_TONE_BADGE,
  },
  defaultVariants: {
    tone: "primary",
  },
});
