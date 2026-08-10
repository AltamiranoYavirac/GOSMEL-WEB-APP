import { tv } from "tailwind-variants";

export const socialAuthButtonsVariants = tv({
  slots: {
    root: "flex flex-col gap-6",
    divider: "flex items-center gap-4",
    dividerLine: "flex-1 h-px bg-border",
    dividerLabel: "text-muted-foreground text-xs uppercase tracking-widest",
    buttons: "flex items-center justify-center",
    button:
      "flex items-center justify-center rounded-xl bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary transition",
  },
  variants: {
    layout: {
      stretch: { buttons: "gap-4", button: "flex-1 h-12" },
      compact: { buttons: "gap-6", button: "size-12" },
    },
  },
  defaultVariants: {
    layout: "stretch",
  },
});
