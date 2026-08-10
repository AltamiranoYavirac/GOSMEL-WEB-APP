import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/shared/lib/utils"

const inputVariants = cva(
  "w-full min-w-0 rounded-lg border border-input bg-background text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      size: {
        default: "h-8 px-2.5 py-1",
        lg: "h-auto px-4 py-3",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

function Input({
  className,
  type,
  size = "default",
  icon,
  iconPosition = "end",
  ...props
}: Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants> & {
    icon?: React.ReactNode
    iconPosition?: "start" | "end"
  }) {
  const field = cn(
    inputVariants({ size }),
    icon && (iconPosition === "start" ? "pl-10" : "pr-10"),
    className
  )

  const input = <input type={type} data-slot="input" className={field} {...props} />

  if (!icon) {
    return input
  }

  return (
    <div className="relative w-full">
      <span
        data-slot="input-icon"
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted-foreground [&_svg]:size-4",
          iconPosition === "start" ? "left-3" : "right-3"
        )}
      >
        {icon}
      </span>
      {input}
    </div>
  )
}

export { Input, inputVariants }
