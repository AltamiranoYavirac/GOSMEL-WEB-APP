import type { FieldValues, FieldPath } from "react-hook-form"

export interface IBaseFieldProps<TFieldValues extends FieldValues = FieldValues> {
  name: FieldPath<TFieldValues>
  label?: React.ReactNode
  required?: boolean
  hint?: React.ReactNode
  disabled?: boolean
  className?: string
  errorIcon?: React.ReactNode
  errorClassName?: string
}
