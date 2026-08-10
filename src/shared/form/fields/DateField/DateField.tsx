"use client"

import { DatePicker, FormField } from "@/shared/ui"
import { useConnectedField } from "../useConnectedField"
import type { IDateFieldProps } from "./DateField.types"

export function DateField<TFieldValues extends Record<string, unknown> = Record<string, unknown>>({
  name,
  label,
  required,
  hint,
  disabled,
  className,
  errorIcon,
  errorClassName,
  placeholder,
  max,
}: IDateFieldProps<TFieldValues>) {
  const { fieldValue, fieldOnChange, fieldOnBlur, error, touched } =
    useConnectedField<TFieldValues>(name)

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
      <DatePicker
        value={(fieldValue as string | null) || null}
        onChange={fieldOnChange}
        onBlur={fieldOnBlur}
        disabled={disabled}
        max={max}
        placeholder={placeholder}
      />
    </FormField>
  )
}
