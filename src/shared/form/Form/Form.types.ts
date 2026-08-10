import type { FieldValues, SubmitHandler, UseFormReturn } from "react-hook-form"

export interface IFormProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>
  onSubmit?: SubmitHandler<TFieldValues> | ((e?: React.BaseSyntheticEvent) => Promise<void>)
  id?: string
  className?: string
  children: React.ReactNode
}
