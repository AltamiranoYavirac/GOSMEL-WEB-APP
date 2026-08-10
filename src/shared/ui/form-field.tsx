"use client"

import * as React from "react"

import { cn } from "@/shared/lib/utils"
import { Label } from "@/shared/ui/label"

export interface IFormFieldProps {
  label?: React.ReactNode
  htmlFor?: string
  name?: string
  required?: boolean
  error?: string
  touched?: boolean
  errorIcon?: React.ReactNode
  errorClassName?: string
  hint?: React.ReactNode
  className?: string
  children: React.ReactNode
}

interface IChildElement {
  props: {
    id?: string
    "aria-invalid"?: boolean | "true" | "false"
  }
}

export function FormField({
  label,
  htmlFor,
  name,
  required,
  error,
  touched = true,
  errorIcon,
  errorClassName,
  hint,
  className,
  children,
}: IFormFieldProps) {
  const showError = touched && !!error
  const invalid = showError

  const resolvedHtmlFor = htmlFor || name

  const child = React.isValidElement(children)
    ? (children as React.ReactElement<unknown> & IChildElement)
    : null

  const clonedChildren = child
    ? React.cloneElement(child, {
        "aria-invalid": invalid || child.props["aria-invalid"],
        ...(name && !child.props.id ? { id: name } : {}),
      })
    : children

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label
          htmlFor={resolvedHtmlFor}
          className="block px-1 text-sm font-semibold text-muted-foreground"
        >
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      {clonedChildren}
      {!showError && hint && (
        <p className="px-1 text-xs text-muted-foreground">{hint}</p>
      )}
      {showError && (
        <div
          className={cn(
            "flex items-start gap-1 px-1 font-normal leading-tight text-destructive",
            errorClassName || "text-sm"
          )}
        >
          {errorIcon}
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
