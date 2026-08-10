import { tv } from "tailwind-variants";

export const sectionHeaderVariants = tv({
  slots: {
    wrapper: "flex flex-col",
    eyebrow: "text-primary font-semibold uppercase tracking-widest",
    title: "font-bold text-foreground",
    description: "text-muted-foreground font-light leading-relaxed",
  },
  variants: {
    align: {
      center: {
        wrapper: "items-center gap-4 text-center",
        eyebrow: "justify-center",
      },
      left: {
        wrapper: "items-start gap-4 text-left",
        eyebrow: "justify-start",
      },
    },
    size: {
      sm: {
        eyebrow: "text-xs",
        title: "text-3xl",
        description: "text-base",
      },
      md: {
        eyebrow: "text-sm",
        title: "text-3xl md:text-5xl",
        description: "text-lg",
      },
      lg: {
        eyebrow: "text-sm",
        title: "text-4xl md:text-6xl",
        description: "text-lg",
      },
    },
    lineAccent: {
      true: {
        eyebrow: "flex items-center gap-2",
      },
    },
  },
  defaultVariants: {
    align: "center",
    size: "md",
  },
});
