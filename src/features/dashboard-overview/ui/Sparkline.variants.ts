import { tv } from "tailwind-variants";

import { ACCENT_TONE_SPARK } from "../model/accent-tone";

export const sparklineVariants = tv({
  base: "h-9 w-24",
  variants: {
    tone: ACCENT_TONE_SPARK,
  },
  defaultVariants: {
    tone: "primary",
  },
});
