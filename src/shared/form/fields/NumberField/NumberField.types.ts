import type { FieldValues } from "react-hook-form"
import type { IBaseFieldProps } from "../useConnectedField"

export interface INumberFieldProps<TFieldValues extends FieldValues = FieldValues>
  extends IBaseFieldProps<TFieldValues> {
  placeholder?: string
  maxLength?: number
  asNumber?: boolean
  integerOnly?: boolean
  inputClassName?: string
  size?: "default" | "lg"
  startIcon?: React.ReactNode
}
