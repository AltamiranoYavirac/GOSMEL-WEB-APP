import type { FieldValues } from "react-hook-form"
import type { IBaseFieldProps } from "../useConnectedField"

export interface ISelectFieldOption {
  value: string
  label: React.ReactNode
}

export interface ISelectFieldProps<TFieldValues extends FieldValues = FieldValues>
  extends IBaseFieldProps<TFieldValues> {
  options: ISelectFieldOption[]
  placeholder?: string
  size?: "default" | "lg" | "sm"
}
