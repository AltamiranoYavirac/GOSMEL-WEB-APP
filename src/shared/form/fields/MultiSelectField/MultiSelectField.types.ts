import type { FieldValues } from "react-hook-form"
import type { IBaseFieldProps } from "../useConnectedField"

export interface IMultiSelectFieldOption {
  value: string
  label: React.ReactNode
}

export interface IMultiSelectFieldProps<TFieldValues extends FieldValues = FieldValues>
  extends IBaseFieldProps<TFieldValues> {
  options: IMultiSelectFieldOption[]
  placeholder?: string
  emptyLabel?: React.ReactNode
}
