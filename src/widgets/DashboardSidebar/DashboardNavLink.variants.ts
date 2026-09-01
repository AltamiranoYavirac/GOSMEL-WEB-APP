import { tv } from "tailwind-variants";

export const dashboardNavLinkVariants = tv({
  base: "relative flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs uppercase tracking-wider font-bold transition-all duration-200",
  variants: {
    active: {
      true: "bg-background text-primary border border-white/60 dark:border-white/5 shadow-[-2px_-2px_6px_rgba(255,255,255,0.8),2px_2px_6px_rgba(169,146,125,0.18)] dark:shadow-[-2px_-2px_6px_rgba(255,255,255,0.03),2px_2px_6px_rgba(0,0,0,0.5)]",
      false: "text-muted-foreground hover:text-foreground hover:bg-background/50 hover:shadow-xs",
    },
  },
  defaultVariants: {
    active: false,
  },
});

export const dashboardNavIconVariants = tv({
  base: "shrink-0 size-4.5 transition-transform duration-200 group-hover:scale-110",
  variants: {
    active: {
      true: "text-primary",
      false: "text-muted-foreground group-hover:text-primary",
    },
  },
  defaultVariants: {
    active: false,
  },
});
