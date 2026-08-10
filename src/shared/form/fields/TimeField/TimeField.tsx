"use client"

import { FormField, TimeInput } from "@/shared/ui"
import { useConnectedField } from "../useConnectedField"
import type { ITimeFieldProps } from "./TimeField.types"

export function TimeField<TFieldValues extends Record<string, unknown> = Record<string, unknown>>({
  name,
  label,
  required,
  hint,
  disabled,
  className,
  errorIcon,
  errorClassName,
  size = "lg",
}: ITimeFieldProps<TFieldValues>) {
  const { fieldName, fieldRef, fieldValue, fieldOnChange, fieldOnBlur, error, touched } =
    useConnectedField<TFieldValues>(name)
  const showError = touched && !!error

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
      <TimeInput
        id={name}
        disabled={disabled}
        name={fieldName}
        ref={fieldRef}
        value={(fieldValue ?? "") as string}
        onChange={(e) => fieldOnChange(e.target.value)}
        onBlur={fieldOnBlur}
        aria-invalid={showError || undefined}
        size={size}
      />
    </FormField>
  )
}
