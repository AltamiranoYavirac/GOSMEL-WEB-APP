"use client"

import { FormField, Textarea } from "@/shared/ui"
import { cn } from "@/shared/lib/utils"
import { useConnectedField } from "../useConnectedField"
import type { ITextareaFieldProps } from "./TextareaField.types"

export function TextareaField<TFieldValues extends Record<string, unknown> = Record<string, unknown>>({
  name,
  label,
  required,
  hint,
  disabled,
  className,
  errorIcon,
  errorClassName,
  placeholder,
  rows = 6,
  maxLength,
  inputClassName,
  externalError,
  onValueChange,
}: ITextareaFieldProps<TFieldValues>) {
  const { fieldName, fieldRef, fieldValue, fieldOnChange, fieldOnBlur, error, touched } =
    useConnectedField<TFieldValues>(name)
  const showError = (!!externalError || touched) && !!(externalError ?? error)

  return (
    <FormField
      label={label}
      name={name}
      required={required}
      hint={hint}
      error={externalError ?? error}
      touched={!!externalError || touched}
      errorIcon={errorIcon}
      errorClassName={errorClassName}
      className={className}
    >
      <Textarea
        id={name}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        name={fieldName}
        ref={fieldRef}
        value={(fieldValue ?? "") as string}
        onChange={(e) => {
          fieldOnChange(e)
          onValueChange?.(e.target.value)
        }}
        onBlur={fieldOnBlur}
        aria-invalid={showError || undefined}
        rows={rows}
        className={cn("px-4 py-3", inputClassName)}
      />
    </FormField>
  )
}
