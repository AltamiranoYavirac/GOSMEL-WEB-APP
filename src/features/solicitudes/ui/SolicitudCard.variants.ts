import { tv } from "tailwind-variants";

export const solicitudCardVariants = tv({
  slots: {
    base: "group overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition-all duration-200 ease-out",
    typeTile: "relative flex size-12 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 ease-out group-hover:-rotate-3 group-hover:scale-105",
    typeLabel: "text-xs font-bold",
    decorativeIcon: "pointer-events-none absolute right-16 top-1/2 hidden size-16 -translate-y-1/2 rotate-6 opacity-[0.07] transition-all duration-300 ease-out group-hover:rotate-12 group-hover:scale-110 group-hover:opacity-[0.13] sm:block",
  },
  variants: {
    expanded: {
      true: {
        base: "border-border shadow-md",
        typeTile: "group-hover:rotate-0 group-hover:scale-100",
        decorativeIcon: "group-hover:rotate-6 group-hover:scale-100 group-hover:opacity-[0.07]",
      },
      false: {
        base: "hover:-translate-y-1 hover:shadow-lg",
      },
    },
    closed: {
      true: {
        base: "opacity-75",
      },
    },
    tone: {
      info: {
        base: "border-info-border",
        typeTile: "border-info-border bg-info-tint text-info-fg",
        typeLabel: "text-info-fg",
        decorativeIcon: "text-info-fg",
      },
      success: {
        base: "border-success-border",
        typeTile: "border-success-border bg-success-tint text-success-fg",
        typeLabel: "text-success-fg",
        decorativeIcon: "text-success-fg",
      },
      warning: {
        base: "border-warning-border",
        typeTile: "border-warning-border bg-warning-tint text-warning-fg",
        typeLabel: "text-warning-fg",
        decorativeIcon: "text-warning-fg",
      },
      neutral: {
        base: "border-border",
        typeTile: "border-border bg-muted text-foreground",
        typeLabel: "text-muted-foreground",
        decorativeIcon: "text-muted-foreground",
      },
    },
  },
  defaultVariants: {
    expanded: false,
    closed: false,
    tone: "neutral",
  },
});
