import { tv } from "tailwind-variants";

export const iconTileVariants = tv({
  base: "flex shrink-0 items-center justify-center bg-muted text-primary",
  variants: {
    size: {
      sm: "p-2 rounded-lg",
      md: "size-14 rounded-xl",
    },
  },
  defaultVariants: {
    size: "md",
  },
});
