import { tv } from "tailwind-variants";

export const dashboardNavLinkVariants = tv({
  base: "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors before:absolute before:inset-y-1 before:left-0 before:w-0.5 before:rounded-full before:bg-primary before:transition-opacity",
  variants: {
    active: {
      true: "bg-primary/12 text-foreground shadow-sm before:opacity-100",
      false: "text-muted-foreground before:opacity-0 hover:bg-sidebar-accent hover:text-foreground",
    },
  },
  defaultVariants: {
    active: false,
  },
});

export const dashboardNavIconVariants = tv({
  base: "shrink-0",
  variants: {
    active: {
      true: "text-primary",
      false: "text-muted-foreground/70 group-hover:text-foreground",
    },
  },
  defaultVariants: {
    active: false,
  },
});
