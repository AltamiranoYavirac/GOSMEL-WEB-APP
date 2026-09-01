"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { Button, Spinner } from "@/shared/ui";

interface IImageUploadFieldProps {
  value?: string | null;
  onChange: (value: string) => void;
  label?: string;
  folder?: string;
  helperText?: string;
}

export function ImageUploadField({
  value,
  onChange,
  label = "Foto de portada / Curso",
  folder = "gosmel/cursos",
  helperText = "Formatos soportados: JPG, PNG, WEBP (Máx. 10MB)",
}: IImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getPreviewUrl = (val: string | null | undefined): string | null => {
    if (!val) return null;
    if (val.startsWith("http://") || val.startsWith("https://")) return val;
    return `https://res.cloudinary.com/dv9lm0fnm/image/upload/q_auto,f_auto,w_800/${val}`;
  };

  const previewUrl = getPreviewUrl(value);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona un archivo de imagen válido");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("La imagen supera el límite de 10MB");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload/cloudinary", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok || json.error) {
        throw new Error(json.error || "Error al subir la imagen");
      }

      onChange(json.public_id || json.secure_url);
      toast.success("Foto subida a Cloudinary correctamente");
    } catch (err: any) {
      toast.error(err.message || "Error al subir la foto");
    } finally {
      setUploading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-semibold text-foreground/90 uppercase tracking-wider">{label}</label>}

      {previewUrl ? (
        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-2">
          <div className="relative h-44 w-full overflow-hidden rounded-lg bg-black/5 dark:bg-white/5">
            <Image
              src={previewUrl}
              alt="Vista previa de portada"
              fill
              unoptimized
              className="object-cover"
            />
            {uploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 backdrop-blur-xs text-white">
                <Spinner className="size-6" />
                <span className="text-xs font-medium">Subiendo foto a Cloudinary...</span>
              </div>
            )}
          </div>

          <div className="mt-2 flex items-center justify-between gap-2 px-1">
            <span className="truncate text-xs text-muted-foreground font-mono">
              {value}
            </span>

            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="xs"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                <Icon icon="ph:arrows-clockwise" className="size-3.5" aria-hidden="true" />
                Cambiar foto
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="xs"
                disabled={uploading}
                className="text-destructive hover:bg-destructive/10"
                onClick={() => onChange("")}
              >
                <Icon icon="ph:trash" className="size-3.5" aria-hidden="true" />
                Quitar
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={onDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-all ${
            isDragOver
              ? "border-primary bg-primary/5"
              : "border-border/80 hover:border-primary/50 hover:bg-card/50"
          }`}
        >
          <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110">
            {uploading ? (
              <Spinner className="size-5" />
            ) : (
              <Icon icon="ph:cloud-arrow-up" className="size-6" aria-hidden="true" />
            )}
          </div>

          <div className="space-y-0.5">
            <p className="text-sm font-medium text-foreground">
              {uploading ? "Subiendo a Cloudinary..." : "Haz clic para subir o arrastra la foto aquí"}
            </p>
            <p className="text-xs text-muted-foreground">{helperText}</p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
        onChange={onFileChange}
      />
    </div>
  );
}
