import type { FieldValues } from "react-hook-form"
import type { IBaseFieldProps } from "../useConnectedField"

export interface IIconPickerOption {
  value: string
  label: string
}

export interface IIconPickerFieldProps<TFieldValues extends FieldValues = FieldValues>
  extends IBaseFieldProps<TFieldValues> {
  suggestedIcons?: IIconPickerOption[]
  placeholder?: string
}
