"use client";

import { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Spinner,
} from "@/shared/ui";
import { Form, SelectField, TextField, useAppForm } from "@/shared/form";

import { useCrearMaterial } from "../hooks/useCrearMaterial";
import { useMaterialOptions } from "../hooks/useMaterialOptions";
import {
  crearMaterialFormSchema,
  DESTINO_OPCIONES,
  getCrearMaterialFormDefaults,
  TIPO_MATERIAL_OPCIONES,
  VISIBILIDAD_MATERIAL_OPCIONES,
  type ICrearMaterialFormValues,
  type TTipoMaterial,
} from "../model/CrearMaterialForm.config";

export default function CrearMaterialDialog() {
  const [open, setOpen] = useState(false);
  const [modo, setModo] = useState<"archivo" | "enlace">("archivo");
  const [subiendoArchivo, setSubiendoArchivo] = useState(false);
  const [archivoCargado, setArchivoCargado] = useState<{
    nombre: string;
    tamano: string;
    url: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const options = useMaterialOptions(open);
  const mutation = useCrearMaterial();
  const form = useAppForm<ICrearMaterialFormValues>({
    schema: crearMaterialFormSchema,
    defaultValues: getCrearMaterialFormDefaults(),
  });
  const destino = form.watch("destino");

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileUpload = async (file: File) => {
    try {
      setSubiendoArchivo(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload/material", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok || json.error) {
        throw new Error(json.error || "Error al subir el archivo");
      }

      form.setValue("storagePath", json.storage_path || json.url);
      form.setValue("archivoNombre", json.filename || file.name);

      if (json.tipo) {
        form.setValue("tipo", json.tipo as TTipoMaterial);
      }

      if (!form.getValues("titulo")) {
        const nombreLimpio = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
        form.setValue("titulo", nombreLimpio.charAt(0).toUpperCase() + nombreLimpio.slice(1));
      }

      setArchivoCargado({
        nombre: json.filename || file.name,
        tamano: formatFileSize(json.size || file.size),
        url: json.url || json.storage_path,
      });

      toast.success("Archivo subido correctamente");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al subir archivo";
      toast.error(message);
    } finally {
      setSubiendoArchivo(false);
    }
  };

  const onSubmit = (values: ICrearMaterialFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        form.reset(getCrearMaterialFormDefaults());
        setArchivoCargado(null);
        setOpen(false);
      },
    });
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setArchivoCargado(null);
      form.reset(getCrearMaterialFormDefaults());
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button>
          <Icon icon="ph:plus" aria-hidden="true" />
          Nuevo material
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-full max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <AlertDialogHeader>
          <AlertDialogTitle>Publicar recurso o material didáctico</AlertDialogTitle>
          <AlertDialogDescription>
            Sube partituras, audios, videos, documentos o enlaces para tus cursos y cátedras.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex rounded-xl border border-border/80 bg-muted/40 p-1">
          <button
            type="button"
            onClick={() => setModo("archivo")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-all ${
              modo === "archivo"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon icon="ph:cloud-arrow-up" className="size-4" />
            Subir archivo (PDF, Audio, Video, Partitura)
          </button>
          <button
            type="button"
            onClick={() => setModo("enlace")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-all ${
              modo === "enlace"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon icon="ph:link" className="size-4" />
            Enlace web / URL externa
          </button>
        </div>

        <Form form={form} onSubmit={onSubmit} id="crear-material" className="flex flex-col gap-4">
          {modo === "archivo" ? (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-foreground/90 uppercase tracking-wider">
                Archivo digital
              </label>

              {archivoCargado ? (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon icon="ph:file-check" className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{archivoCargado.nombre}</p>
                      <p className="text-xs text-muted-foreground">{archivoCargado.tamano}</p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={() => {
                      setArchivoCargado(null);
                      form.setValue("storagePath", "");
                      form.setValue("archivoNombre", "");
                    }}
                  >
                    <Icon icon="ph:trash" className="size-3.5" />
                    Cambiar archivo
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => !subiendoArchivo && fileInputRef.current?.click()}
                  className="group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/80 p-6 text-center transition-all hover:border-primary/50 hover:bg-card/50"
                >
                  <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110">
                    {subiendoArchivo ? (
                      <Spinner className="size-5" />
                    ) : (
                      <Icon icon="ph:cloud-arrow-up" className="size-6" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-foreground">
                      {subiendoArchivo ? "Subiendo y procesando archivo..." : "Haz clic para subir tu archivo"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, Partituras (MusicXML), Audio (MP3, WAV), Video (MP4), Imágenes o ZIP (Hasta 100MB)
                    </p>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.mp3,.wav,.aac,.m4a,.ogg,.mp4,.webm,.mov,.musicxml,.mxl,.xml,.mscz,.png,.jpg,.jpeg,.webp,.zip"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileUpload(f);
                }}
              />
            </div>
          ) : (
            <TextField
              name="urlExterna"
              label="URL externa del recurso"
              placeholder="https://youtube.com/watch?v=... o https://drive.google.com/..."
              startIcon={<Icon icon="ph:link" className="size-4" aria-hidden="true" />}
            />
          )}

          <TextField name="titulo" label="Título del material" placeholder="Ej. Partitura — Estudio No. 1 en Do Mayor" />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <SelectField name="tipo" label="Tipo de contenido" options={TIPO_MATERIAL_OPCIONES} />
            <SelectField name="visibilidad" label="Quién puede verlo" options={VISIBILIDAD_MATERIAL_OPCIONES} />
          </div>

          <SelectField name="destino" label="Asociar a (opcional)" placeholder="Sin asociar (Público general)" options={DESTINO_OPCIONES} />

          {destino === "curso" ? (
            <SelectField
              name="cursoId"
              label="Curso"
              placeholder="Seleccione un curso"
              disabled={options.isPending}
              options={(options.data?.cursos ?? []).map((curso) => ({ value: curso.id, label: curso.nombre }))}
            />
          ) : null}

          {destino === "catedra" ? (
            <SelectField
              name="catedraId"
              label="Cátedra"
              placeholder="Seleccione una cátedra"
              disabled={options.isPending}
              options={(options.data?.catedras ?? []).map((catedra) => ({ value: catedra.id, label: catedra.label }))}
            />
          ) : null}
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button form="crear-material" type="submit" disabled={mutation.isPending || subiendoArchivo}>
            {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            Publicar material
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}