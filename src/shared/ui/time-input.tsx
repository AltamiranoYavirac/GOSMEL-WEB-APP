"use client"

import { Input } from "@/shared/ui/input"
import { cn } from "@/shared/lib/utils"

export interface ITimeInputProps
  extends Omit<React.ComponentProps<"input">, "type" | "size"> {
  size?: React.ComponentProps<typeof Input>["size"]
}

export function TimeInput({ className, size = "lg", ...props }: ITimeInputProps) {
  return (
    <Input
      type="time"
      data-slot="time-input"
      size={size}
      className={cn("cursor-text", className)}
      {...props}
    />
  )
}
