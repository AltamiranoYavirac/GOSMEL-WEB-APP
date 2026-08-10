"use client"

import { FormProvider } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import type { IFormProps } from "./Form.types"

export function Form<TFieldValues extends Record<string, unknown>>({
  form,
  onSubmit,
  id,
  className,
  children,
}: IFormProps<TFieldValues>) {
  return (
    <FormProvider {...form}>
      <form
        id={id}
        noValidate
        className={className}
        onSubmit={
          onSubmit
            ? form.handleSubmit(onSubmit as SubmitHandler<TFieldValues>)
            : (e) => e.preventDefault()
        }
      >
        {children}
      </form>
    </FormProvider>
  )
}
