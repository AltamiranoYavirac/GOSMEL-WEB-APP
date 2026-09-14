"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { CLOUDINARY_IMAGE_TYPES, CLOUDINARY_MAX_IMAGE_SIZE } from "@/shared/config";
import { compressImageFile } from "@/shared/lib/image-compression";
import { buildCloudinaryImageUrl } from "@/shared/lib";
import { Button, Spinner } from "@/shared/ui";

import type { IImageUploadFieldProps } from "./ImageUploadField.types";

export function ImageUploadField({
  value,
  file,
  onFileChange,
  onRemove,
  label = "Imagen",
  helperText = "JPG, PNG o WEBP · Máx. 10 MB",
  disabled = false,
}: IImageUploadFieldProps) {
  const [processing, setProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const localPreviewRef = useRef<string | null>(null);

  useEffect(() => () => {
    if (localPreviewRef.current) URL.revokeObjectURL(localPreviewRef.current);
  }, []);

  const clearLocalPreview = () => {
    if (localPreviewRef.current) URL.revokeObjectURL(localPreviewRef.current);
    localPreviewRef.current = null;
    setLocalPreviewUrl(null);
  };

  const previewUrl = localPreviewUrl ?? buildCloudinaryImageUrl(value, "q_auto,f_auto,w_800");

  const handleFile = async (selectedFile: File) => {
    if (!(CLOUDINARY_IMAGE_TYPES as readonly string[]).includes(selectedFile.type)) {
      toast.error("Selecciona una imagen JPG, PNG o WEBP.");
      return;
    }
    if (selectedFile.size > CLOUDINARY_MAX_IMAGE_SIZE) {
      toast.error("La imagen supera el límite de 10 MB.");
      return;
    }

    setProcessing(true);
    try {
      const compressed = await compressImageFile(selectedFile, {
        maxWidth: 1800,
        maxHeight: 1800,
        maxSizeInBytes: 4 * 1024 * 1024,
      });
      clearLocalPreview();
      const preview = URL.createObjectURL(compressed);
      localPreviewRef.current = preview;
      setLocalPreviewUrl(preview);
      onFileChange(compressed);
    } catch {
      toast.error("No se pudo procesar la imagen. Intenta con otro archivo.");
    } finally {
      setProcessing(false);
    }
  };

  const openPicker = () => {
    if (!disabled && !processing) fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <span className="block text-xs font-semibold uppercase tracking-wider text-foreground/90">{label}</span>

      {previewUrl ? (
        <div className="overflow-hidden rounded-xl border border-border bg-card p-2">
          <div className="relative h-44 w-full overflow-hidden rounded-lg bg-accent-muted">
            <Image src={previewUrl} alt="Vista previa" fill unoptimized className="object-cover" />
            {processing ? (
              <div className="absolute inset-0 flex items-center justify-center bg-scrim-strong text-surface-dark-foreground">
                <Spinner className="size-6" />
              </div>
            ) : null}
          </div>
          <div className="mt-2 flex items-center justify-between gap-1.5 px-1">
            <span className="min-w-0 truncate text-xs text-muted-foreground">{file?.name ?? value}</span>
            <Button type="button" variant="outline" size="xs" disabled={disabled || processing} onClick={openPicker}>
              <Icon icon="ph:arrows-clockwise" className="size-3.5" aria-hidden="true" />
              Cambiar imagen
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              disabled={disabled || processing}
              className="text-destructive hover:bg-destructive/10"
              onClick={() => {
                clearLocalPreview();
                onFileChange(null);
                onRemove();
              }}
            >
              <Icon icon="ph:trash" className="size-3.5" aria-hidden="true" />
              Quitar
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled || processing}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragOver(false);
            const selectedFile = event.dataTransfer.files?.[0];
            if (selectedFile) void handleFile(selectedFile);
          }}
          onClick={openPicker}
          className={`group flex min-h-36 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            isDragOver ? "border-primary bg-primary/5" : "border-border/80 hover:border-primary/50 hover:bg-card/50"
          }`}
        >
          <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            {processing ? <Spinner className="size-5" /> : <Icon icon="ph:image-square" className="size-6" aria-hidden="true" />}
          </span>
          <span className="text-sm font-medium text-foreground">
            {processing ? "Procesando imagen…" : "Selecciona o arrastra una imagen"}
          </span>
          <span className="text-xs text-muted-foreground">{helperText}</span>
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={CLOUDINARY_IMAGE_TYPES.join(",")}
        className="hidden"
        disabled={disabled || processing}
        onChange={(event) => {
          const selectedFile = event.target.files?.[0];
          if (selectedFile) void handleFile(selectedFile);
          event.target.value = "";
        }}
      />
    </div>
  );
}
