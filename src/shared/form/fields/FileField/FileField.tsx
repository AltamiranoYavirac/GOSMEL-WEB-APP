"use client"

import { FileUpload } from "@/shared/ui"
import { useConnectedField } from "../useConnectedField"
import type { IFileFieldProps } from "./FileField.types"

export function FileField<TFieldValues extends Record<string, unknown> = Record<string, unknown>>({
  name,
  disabled,
  className,
  accept,
  maxSize,
  uploadLabel,
  uploadHint,
}: IFileFieldProps<TFieldValues>) {
  const { fieldValue, fieldOnChange, error } = useConnectedField<TFieldValues>(name)

  return (
    <div className={className}>
      <FileUpload
        value={(fieldValue as File | null) ?? null}
        onChange={fieldOnChange}
        accept={accept}
        maxSize={maxSize}
        label={uploadLabel}
        hint={uploadHint}
        disabled={disabled}
        error={error}
      />
    </div>
  )
}
