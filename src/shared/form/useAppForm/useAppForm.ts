"use client"

import { useForm } from "react-hook-form"
import type { Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { IUseAppFormOptions, IUseAppFormReturn } from "./useAppForm.types"

export function useAppForm<TFieldValues extends Record<string, unknown>>({
  schema,
  mode,
  reValidateMode,
  ...options
}: IUseAppFormOptions<TFieldValues>): IUseAppFormReturn<TFieldValues> {
  return useForm<TFieldValues>({
    resolver: zodResolver(schema) as unknown as Resolver<TFieldValues>,
    mode: mode ?? "onTouched",
    reValidateMode: reValidateMode ?? "onChange",
    ...options,
  })
}
