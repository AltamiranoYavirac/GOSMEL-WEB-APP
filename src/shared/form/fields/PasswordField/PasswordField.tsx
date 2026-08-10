"use client"

import { useState } from "react"
import { Icon } from "@iconify/react"

import { Button, FormField, Input } from "@/shared/ui"
import { cn } from "@/shared/lib/utils"
import { useConnectedField } from "../useConnectedField"
import type { IPasswordFieldProps } from "./PasswordField.types"

export function PasswordField<TFieldValues extends Record<string, unknown> = Record<string, unknown>>({
  name,
  label,
  required,
  hint,
  disabled,
  className,
  errorIcon,
  errorClassName,
  placeholder,
  autoComplete = "current-password",
  inputClassName,
  size = "lg",
  startIcon,
  externalError,
  onValueChange,
}: IPasswordFieldProps<TFieldValues>) {
  const [show, setShow] = useState(false)
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
      <div className="relative flex items-center">
        <Input
          id={name}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
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
          className={cn(startIcon ? "pl-10" : "pl-4", "relative z-0 pr-10", inputClassName)}
        />
        {startIcon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-muted-foreground">
            {startIcon}
          </span>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
          className="absolute right-1.5 top-1/2 z-10 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <Icon
            icon={show ? "ph:eye-slash" : "ph:eye"}
            className="size-[18px]"
            aria-hidden="true"
          />
        </Button>
      </div>
    </FormField>
  )
}
