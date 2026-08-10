"use client"

import { Label, Switch } from "@/shared/ui"
import { cn } from "@/shared/lib/utils"
import { useConnectedField } from "../useConnectedField"
import type { ISwitchFieldProps } from "./SwitchField.types"

export function SwitchField<TFieldValues extends Record<string, unknown> = Record<string, unknown>>({
  name,
  label,
  disabled,
  className,
  labelClassName,
}: ISwitchFieldProps<TFieldValues>) {
  const { fieldValue, fieldOnChange } = useConnectedField<TFieldValues>(name)

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Switch
        id={name}
        checked={!!fieldValue}
        onCheckedChange={fieldOnChange}
        disabled={disabled}
      />
      {label && (
        <Label htmlFor={name} className={cn("cursor-pointer text-base text-foreground", labelClassName)}>
          {label}
        </Label>
      )}
    </div>
  )
}
