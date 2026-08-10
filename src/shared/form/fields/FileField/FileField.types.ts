import type { FieldValues } from "react-hook-form"
import type { IBaseFieldProps } from "../useConnectedField"

export interface IFileFieldProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<IBaseFieldProps<TFieldValues>, "errorIcon" | "errorClassName"> {
  accept?: string
  maxSize?: number
  uploadLabel?: string
  uploadHint?: string
}
