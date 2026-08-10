"use client"

import { FormField, Input } from "@/shared/ui"
import { cn } from "@/shared/lib/utils"
import { useConnectedField } from "../useConnectedField"
import type { INumberFieldProps } from "./NumberField.types"

export function NumberField<TFieldValues extends Record<string, unknown> = Record<string, unknown>>({
  name,
  label,
  required,
  hint,
  disabled,
  className,
  errorIcon,
  errorClassName,
  placeholder,
  maxLength,
  asNumber = false,
  integerOnly = true,
  inputClassName,
  size = "lg",
  startIcon,
}: INumberFieldProps<TFieldValues>) {
  const { fieldName, fieldRef, fieldValue, fieldOnChange, fieldOnBlur, error, touched } =
    useConnectedField<TFieldValues>(name)
  const showError = touched && !!error

  const input = (
    <Input
      id={name}
      type="text"
      inputMode="numeric"
      placeholder={placeholder}
      maxLength={maxLength}
      disabled={disabled}
      name={fieldName}
      ref={fieldRef}
      value={(fieldValue ?? "") as string}
      onChange={(e) => {
        let raw = e.target.value
        if (integerOnly) {
          raw = raw.replace(/[^\d]/g, "")
        } else {
          raw = raw.replace(/[^\d.]/g, "")
          const parts = raw.split(".")
          if (parts.length > 2) raw = parts[0] + "." + parts.slice(1).join("")
        }
        if (asNumber) {
          const num = raw === "" ? null : Number(raw)
          fieldOnChange(num !== null && !isNaN(num) ? num : (null as unknown as number))
        } else {
          fieldOnChange(raw)
        }
      }}
      onBlur={fieldOnBlur}
      aria-invalid={showError || undefined}
      size={size}
      className={cn(startIcon && "pl-10", inputClassName)}
    />
  )

  return (
    <FormField
      label={label}
      name={name}
      required={required}
      hint={hint}
      error={error}
      touched={touched}
      errorIcon={errorIcon}
      errorClassName={errorClassName}
      className={className}
    >
      {startIcon ? (
        <div className="relative flex items-center">
          {input}
          <span className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-muted-foreground">
            {startIcon}
          </span>
        </div>
      ) : (
        input
      )}
    </FormField>
  )
}
