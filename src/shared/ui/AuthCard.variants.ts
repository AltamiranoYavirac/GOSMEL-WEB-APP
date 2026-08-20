import { tv } from "tailwind-variants";

export const authCardVariants = tv({
  slots: {
    root: "relative flex w-full flex-1 flex-col items-center justify-center overflow-hidden bg-auth-canvas px-6 py-12 sm:px-12 lg:px-16",
    card: "animate-in fade-in-up relative z-10 w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-xl shadow-primary/5 duration-700 ease-out sm:p-10",
    mobileBrand: "mb-8 flex flex-col items-center gap-3 text-center lg:hidden",
    header: "mb-8 flex flex-col items-start gap-3",
  },
});
