import type { FieldValues, UseFormProps, UseFormReturn } from "react-hook-form"
import type { zodResolver } from "@hookform/resolvers/zod"

export interface IUseAppFormOptions<TFieldValues extends FieldValues>
  extends Omit<UseFormProps<TFieldValues>, "resolver"> {
  schema: Parameters<typeof zodResolver>[0]
}

export type IUseAppFormReturn<TFieldValues extends FieldValues> = UseFormReturn<TFieldValues>
