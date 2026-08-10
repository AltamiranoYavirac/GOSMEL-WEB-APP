import type { FieldValues } from "react-hook-form"
import type { IBaseFieldProps } from "../useConnectedField"

export interface ISwitchFieldProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<IBaseFieldProps<TFieldValues>, "required" | "hint"> {
  label?: React.ReactNode
  labelClassName?: string
}
