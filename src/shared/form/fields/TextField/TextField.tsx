"use client"

import { FormField, Input } from "@/shared/ui"
import { cn } from "@/shared/lib/utils"
import { useConnectedField } from "../useConnectedField"
import type { ITextFieldProps } from "./TextField.types"

export function TextField<TFieldValues extends Record<string, unknown> = Record<string, unknown>>({
  name,
  label,
  required,
  hint,
  disabled,
  className,
  errorIcon,
  errorClassName,
  type = "text",
  placeholder,
  autoComplete,
  maxLength,
  inputMode,
  inputClassName,
  size = "lg",
  startIcon,
  endAdornment,
  externalError,
  onValueChange,
}: ITextFieldProps<TFieldValues>) {
  const { fieldName, fieldRef, fieldValue, fieldOnChange, fieldOnBlur, error, touched } =
    useConnectedField<TFieldValues>(name)
  const showError = (!!externalError || touched) && !!(externalError ?? error)

  const input = (
    <Input
      id={name}
      type={type}
      placeholder={placeholder}
      autoComplete={autoComplete}
      maxLength={maxLength}
      inputMode={inputMode}
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
      size={size}
      className={cn(startIcon && "pl-10", endAdornment && "pr-10", inputClassName)}
    />
  )

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
      {startIcon || endAdornment ? (
        <div className="relative flex items-center">
          {input}
          {startIcon && (
            <span className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-muted-foreground">
              {startIcon}
            </span>
          )}
          {endAdornment && (
            <span className="absolute right-1.5 top-1/2 z-10 -translate-y-1/2">
              {endAdornment}
            </span>
          )}
        </div>
      ) : (
        input
      )}
    </FormField>
  )
}
