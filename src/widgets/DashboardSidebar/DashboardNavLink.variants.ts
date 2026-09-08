import { tv } from "tailwind-variants";

export const dashboardNavLinkVariants = tv({
  base: "relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-[0.781rem] font-semibold transition-colors duration-150",
  variants: {
    active: {
      true: "bg-foreground/10 text-foreground font-bold",
      false: "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
    },
  },
  defaultVariants: {
    active: false,
  },
});

export const dashboardNavIconVariants = tv({
  base: "shrink-0 size-4 transition-colors duration-150",
  variants: {
    active: {
      true: "text-foreground",
      false: "text-muted-foreground group-hover:text-foreground",
    },
  },
  defaultVariants: {
    active: false,
  },
});
