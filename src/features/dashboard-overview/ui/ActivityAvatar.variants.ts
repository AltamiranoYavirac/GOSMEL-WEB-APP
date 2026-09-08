import { tv } from "tailwind-variants";

import { ACCENT_TONE_AVATAR } from "../model/accent-tone";

export const activityAvatarVariants = tv({
  base: "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
  variants: {
    tone: ACCENT_TONE_AVATAR,
  },
  defaultVariants: {
    tone: "neutral",
  },
});
