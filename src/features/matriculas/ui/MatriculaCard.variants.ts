import { tv } from "tailwind-variants";

export const matriculaCardVariants = tv({
  slots: {
    base: "group overflow-hidden rounded-2xl border border-warning-border bg-card text-card-foreground shadow-sm transition-all duration-200 ease-out",
    tile: "relative flex size-12 shrink-0 items-center justify-center rounded-xl border border-warning-border bg-warning-tint text-warning-fg transition-transform duration-300 ease-out group-hover:-rotate-3 group-hover:scale-105",
    typeLabel: "text-xs font-bold text-warning-fg",
    decorativeIcon:
      "pointer-events-none absolute top-1/2 right-16 hidden size-16 -translate-y-1/2 rotate-6 text-warning-fg opacity-[0.07] transition-all duration-300 ease-out group-hover:rotate-12 group-hover:scale-110 group-hover:opacity-[0.13] sm:block",
  },
  variants: {
    expanded: {
      true: {
        base: "shadow-md",
        tile: "group-hover:rotate-0 group-hover:scale-100",
        decorativeIcon: "group-hover:rotate-6 group-hover:scale-100 group-hover:opacity-[0.07]",
      },
      false: {
        base: "hover:-translate-y-1 hover:shadow-lg",
      },
    },
  },
  defaultVariants: {
    expanded: false,
  },
});
