import type { FieldValues } from "react-hook-form"
import type { IBaseFieldProps } from "../useConnectedField"

export interface IPhotoFieldProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<IBaseFieldProps<TFieldValues>, "errorIcon" | "errorClassName"> {
  uploadLabel?: string
  uploadHint?: string
}
