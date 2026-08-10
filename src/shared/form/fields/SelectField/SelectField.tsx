"use client"

import {
  FormField,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui"
import { useConnectedField } from "../useConnectedField"
import type { ISelectFieldProps } from "./SelectField.types"

export function SelectField<TFieldValues extends Record<string, unknown> = Record<string, unknown>>({
  name,
  label,
  required,
  hint,
  disabled,
  className,
  errorIcon,
  errorClassName,
  options,
  placeholder = "Seleccione una opción",
  size = "lg",
}: ISelectFieldProps<TFieldValues>) {
  const { fieldValue, fieldOnChange, fieldOnBlur, error, touched } =
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
      <Select value={(fieldValue ?? "") as string} onValueChange={fieldOnChange} disabled={disabled}>
        <SelectTrigger
          id={name}
          onBlur={fieldOnBlur}
          aria-invalid={showError || undefined}
          size={size}
          className="w-full"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  )
}
