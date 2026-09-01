"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { Icon } from "@iconify/react"

import { cn } from "@/shared/lib/utils"
import { UI_ICONS } from "@/shared/config"
import { Button, Input } from "@/shared/ui"
import type { IFileUploadProps } from "./FileUpload.types"

const DEFAULT_ACCEPT = "image/jpeg,image/png"
const DEFAULT_MAX_SIZE = 5 * 1024 * 1024

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileUpload({
  value,
  onChange,
  accept = DEFAULT_ACCEPT,
  maxSize = DEFAULT_MAX_SIZE,
  label,
  hint = "JPG o PNG · Opcional",
  disabled = false,
  error,
  icon,
}: IFileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const isImage = useMemo(() => !!value && value.type.startsWith("image/"), [value])

  const previewUrl = useMemo(() => {
    if (!value || !isImage) return null
    return URL.createObjectURL(value)
  }, [value, isImage])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const isValidFile = useCallback(
    (file: File) => {
      if (!accept.split(",").some((type) => file.type.match(type.trim()))) return false
      if (file.size > maxSize) return false
      return true
    },
    [accept, maxSize]
  )

  const processFile = useCallback(
    (file: File | null) => {
      if (!file || !isValidFile(file)) return
      onChange(file)
    },
    [isValidFile, onChange]
  )

  const handleClick = useCallback(() => {
    if (!disabled) inputRef.current?.click()
  }, [disabled])

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] ?? null
      processFile(file)
      if (inputRef.current) inputRef.current.value = ""
    },
    [processFile]
  )

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      setIsDragging(false)
      if (disabled) return
      processFile(event.dataTransfer.files?.[0] ?? null)
    },
    [disabled, processFile]
  )

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      setIsDragging(true)
    },
    []
  )

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      setIsDragging(false)
    },
    []
  )

  const handleRemove = useCallback(() => onChange(null), [onChange])

  const hasFile = !!value

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block px-1 text-sm font-semibold text-muted-foreground">
          {label}
        </label>
      )}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            handleClick()
          }
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "group relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-lg border border-dashed border-input bg-muted p-8 transition-colors outline-none",
          isDragging && "border-primary bg-primary/5",
          !disabled && !hasFile && "cursor-pointer hover:border-primary hover:bg-primary/5",
          !disabled && hasFile && isImage && "cursor-pointer",
          disabled && "pointer-events-none opacity-50",
          error && "border-destructive bg-destructive/5"
        )}
      >
        <Input
          ref={inputRef}
          type="file"
          accept={accept}
          disabled={disabled}
          onChange={handleFileChange}
          className="sr-only"
        />

        {hasFile ? (
          isImage && previewUrl ? (
            <div className="relative flex w-full flex-col items-center gap-3">
              <div className="relative h-40 w-40 overflow-hidden rounded-lg ring-1 ring-input">
                <Image
                  src={previewUrl}
                  alt={value?.name ?? "Vista previa"}
                  fill
                  unoptimized
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity group-hover:bg-black/40 group-hover:opacity-100">
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
                    <Icon icon="ph:pencil-simple" className="size-3.5" aria-hidden="true" /> Cambiar
                  </span>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemove()
                  }}
                  className="absolute -right-2 -top-2 rounded-full shadow-sm"
                  aria-label="Eliminar foto"
                >
                  <Icon icon={UI_ICONS.close} className="size-3.5" aria-hidden="true" />
                </Button>
              </div>
              <div className="text-center">
                <p className="max-w-55 truncate text-sm font-medium text-foreground">{value?.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(value!.size)}</p>
              </div>
            </div>
          ) : (
            <div className="relative flex flex-col items-center gap-3">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-primary/10">
                  <Icon icon="ph:file-text" className="size-10 text-primary" aria-hidden="true" />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemove()
                  }}
                  className="absolute -right-2 -top-2 rounded-full shadow-sm"
                  aria-label="Eliminar archivo"
                >
                  <Icon icon={UI_ICONS.close} className="size-3.5" aria-hidden="true" />
                </Button>
              </div>
              <div className="text-center">
                <p className="max-w-55 truncate text-sm font-medium text-foreground">{value?.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(value!.size)}</p>
              </div>
            </div>
          )
        ) : (
          <>
            <div
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 transition-transform",
                isDragging && "scale-110"
              )}
            >
              {icon ?? (
                <Icon
                  icon={isDragging ? "ph:upload-simple" : "ph:camera"}
                  className="size-7 text-primary"
                  aria-hidden="true"
                />
              )}
            </div>
            <div className="text-center">
              <p className="text-base text-foreground">
                Arrastra un archivo o{" "}
                <span className="font-semibold text-primary underline">haz click para subir</span>
              </p>
              {hint && <p className="mt-1 text-sm text-muted-foreground">{hint}</p>}
            </div>
          </>
        )}
      </div>
      {error && <p className="px-1 text-xs text-destructive">{error}</p>}
    </div>
  )
}
