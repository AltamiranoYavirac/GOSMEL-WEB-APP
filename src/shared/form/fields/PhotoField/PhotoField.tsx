"use client"

import { useCallback, useState } from "react"
import { Icon } from "@iconify/react"

import { FileUpload } from "@/shared/ui"
import { compressImageFile } from "@/shared/lib/utils/image-compression"
import { useConnectedField } from "../useConnectedField"
import type { IPhotoFieldProps } from "./PhotoField.types"

const DEFAULT_ACCEPT = "image/jpeg,image/png"
const DEFAULT_MAX_SIZE = 2 * 1024 * 1024

export function PhotoField<TFieldValues extends Record<string, unknown> = Record<string, unknown>>({
  name,
  disabled,
  className,
  uploadLabel,
  uploadHint,
}: IPhotoFieldProps<TFieldValues>) {
  const { fieldValue, fieldOnChange, error } = useConnectedField<TFieldValues>(name)
  const [compressError, setCompressError] = useState<string | null>(null)

  const handleChange = useCallback(
    async (file: File | null) => {
      setCompressError(null)
      if (!file) {
        fieldOnChange(file)
        return
      }
      try {
        const compressed = await compressImageFile(file, {
          maxWidth: 512,
          maxHeight: 512,
          maxSizeInBytes: DEFAULT_MAX_SIZE,
        })
        fieldOnChange(compressed)
      } catch {
        setCompressError("No se pudo procesar la imagen. Intenta con otro archivo.")
      }
    },
    [fieldOnChange]
  )

  return (
    <div className={className}>
      <FileUpload
        value={(fieldValue as File | null) ?? null}
        onChange={handleChange}
        accept={DEFAULT_ACCEPT}
        maxSize={DEFAULT_MAX_SIZE}
        label={uploadLabel}
        hint={uploadHint ?? "JPG o PNG · Máx. 2 MB"}
        disabled={disabled}
        error={error ?? compressError ?? undefined}
        icon={<Icon icon="ph:camera" className="size-7 text-primary" aria-hidden="true" />}
      />
    </div>
  )
}
