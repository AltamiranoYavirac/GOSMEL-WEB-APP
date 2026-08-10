import type { FieldValues } from "react-hook-form"
import type { IBaseFieldProps } from "../useConnectedField"

export interface ITextFieldProps<TFieldValues extends FieldValues = FieldValues>
  extends IBaseFieldProps<TFieldValues> {
  type?: "text" | "email" | "tel" | "url" | "search"
  placeholder?: string
  autoComplete?: string
  maxLength?: number
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]
  inputClassName?: string
  size?: "default" | "lg"
  startIcon?: React.ReactNode
  endAdornment?: React.ReactNode
  externalError?: string
  onValueChange?: (value: string) => void
}
