"use client"

import { useController, type FieldPath, type FieldValues } from "react-hook-form"

export function useConnectedField<TFieldValues extends FieldValues>(
  name: FieldPath<TFieldValues>
) {
  const {
    field: { name: fieldName, ref, value, onChange, onBlur },
    fieldState,
    formState,
  } = useController<TFieldValues>({ name })

  return {
    fieldName,
    fieldRef: ref,
    fieldValue: value,
    fieldOnChange: onChange,
    fieldOnBlur: onBlur,
    error: fieldState.error?.message,
    touched: fieldState.isTouched || formState.isSubmitted,
  }
}
