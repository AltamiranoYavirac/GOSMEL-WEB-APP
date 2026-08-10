"use client"

import { Checkbox, Label } from "@/shared/ui"
import { cn } from "@/shared/lib/utils"
import { useConnectedField } from "../useConnectedField"
import type { ICheckboxFieldProps } from "./CheckboxField.types"

export function CheckboxField<TFieldValues extends Record<string, unknown> = Record<string, unknown>>({
  name,
  label,
  disabled,
  className,
}: ICheckboxFieldProps<TFieldValues>) {
  const { fieldValue, fieldOnChange, fieldOnBlur, error, touched } =
    useConnectedField<TFieldValues>(name)
  const showError = touched && !!error

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center gap-2.5 px-1">
        <Checkbox
          id={name}
          checked={!!fieldValue}
          onCheckedChange={fieldOnChange}
          onBlur={fieldOnBlur}
          disabled={disabled}
        />
        <Label htmlFor={name} className="cursor-pointer text-sm font-medium text-muted-foreground">
          {label}
        </Label>
      </div>
      {showError && <p className="px-1 text-xs text-destructive">{error}</p>}
    </div>
  )
}
