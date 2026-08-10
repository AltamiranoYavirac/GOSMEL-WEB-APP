import type { FieldValues } from "react-hook-form"
import type { IBaseFieldProps } from "../useConnectedField"

export interface ITextareaFieldProps<TFieldValues extends FieldValues = FieldValues>
  extends IBaseFieldProps<TFieldValues> {
  placeholder?: string
  rows?: number
  maxLength?: number
  inputClassName?: string
  externalError?: string
  onValueChange?: (value: string) => void
}
