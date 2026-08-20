import { tv } from "tailwind-variants";

import { ACCENT_TONE_AVATAR } from "../model/accent-tone";

export const activityAvatarVariants = tv({
  base: "flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-primary-foreground",
  variants: {
    tone: ACCENT_TONE_AVATAR,
  },
  defaultVariants: {
    tone: "primary",
  },
});
