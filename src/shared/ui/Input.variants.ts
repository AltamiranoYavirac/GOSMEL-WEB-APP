import { tv } from "tailwind-variants";

export const inputVariants = tv({
  slots: {
    root: "relative flex w-full items-center",
    field:
      "w-full bg-white border text-cocoa placeholder:text-taupe/70 outline-none transition-colors px-4 py-3 rounded-lg focus:ring-1 disabled:opacity-50 disabled:cursor-not-allowed",
    icon: "pointer-events-none absolute text-taupe [&_svg]:size-4",
  },
  variants: {
    state: {
      default: {
        field: "border-peach focus:border-ginger focus:ring-ginger",
      },
      error: {
        field: "border-red-400 focus:border-red-500 focus:ring-red-500",
      },
    },
    iconPosition: {
      none: {},
      start: { field: "pl-11", icon: "left-4" },
      end: { field: "pr-11", icon: "right-4" },
    },
  },
  defaultVariants: {
    state: "default",
    iconPosition: "none",
  },
});
