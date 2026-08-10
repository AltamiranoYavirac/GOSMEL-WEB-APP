import { tv } from "tailwind-variants";

export const mediaFrameVariants = tv({
  base: "relative overflow-hidden rounded-2xl border border-border shadow-xl group",
  variants: {
    variant: {
      video: "w-full",
      image: "",
    },
    aspect: {
      video: "aspect-video",
      portrait: "aspect-[9/16]",
      tall: "aspect-[4/5]",
      fixed: "h-[200px]",
    },
  },
  defaultVariants: {
    variant: "image",
    aspect: "video",
  },
});
