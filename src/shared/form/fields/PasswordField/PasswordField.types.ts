import type { FieldValues } from "react-hook-form"
import type { IBaseFieldProps } from "../useConnectedField"

export interface IPasswordFieldProps<TFieldValues extends FieldValues = FieldValues>
  extends IBaseFieldProps<TFieldValues> {
  placeholder?: string
  autoComplete?: "current-password" | "new-password"
  inputClassName?: string
  size?: "default" | "lg"
  startIcon?: React.ReactNode
  externalError?: string
  onValueChange?: (value: string) => void
}
