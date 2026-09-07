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
  Button,
} from "@/shared/ui";
import {
  Form,
  SelectField,
  TextField,
  useAppForm,
} from "@/shared/form";

import { useCreateTeacherMaterial } from "../hooks/useCreateTeacherMaterial";
import { useTeacherCatalogos } from "../hooks/useTeacherCatalogos";
import {
  getTeacherMaterialFormDefaults,
  MATERIAL_TIPO_OPCIONES,
  MATERIAL_VISIBILIDAD_OPCIONES,
  teacherMaterialFormSchema,
  type ITeacherMaterialFormValues,
  type TTipoMaterial,
} from "../model/TeacherMaterialForm.config";
import type { ICrearMaterialTeacherDialogProps } from "./CrearMaterialTeacherDialog.types";

export default function CrearMaterialTeacherDialog({
  open,
  onOpenChange,
  defaultCatedraId = "",
}: ICrearMaterialTeacherDialogProps) {
  const { data: catalogos } = useTeacherCatalogos(open);
  const createMutation = useCreateTeacherMaterial();

  const [modo, setModo] = useState<"archivo" | "enlace">("archivo");
  const [subiendoArchivo, setSubiendoArchivo] = useState(false);
  const [archivoNombre, setArchivoNombre] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useAppForm<ITeacherMaterialFormValues>({
    schema: teacherMaterialFormSchema,
    defaultValues: getTeacherMaterialFormDefaults(defaultCatedraId),
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      form.reset(getTeacherMaterialFormDefaults(defaultCatedraId));
      setArchivoNombre(null);
      setModo("archivo");
    }
    onOpenChange(nextOpen);
  };

  const catedraOptions = (catalogos?.catedras ?? []).map((c) => ({
    value: c.id,
    label: `${c.codigo} · ${c.cursoNombre}`,
  }));

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
        throw new Error(json.error || "Error al subir archivo");
      }

      form.setValue("storagePath", json.storage_path || json.url);
      setArchivoNombre(file.name);

      if (json.tipo) {
        form.setValue("tipo", json.tipo as TTipoMaterial);
      }

      if (!form.getValues("titulo")) {
        const nombreLimpio = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
        form.setValue("titulo", nombreLimpio.charAt(0).toUpperCase() + nombreLimpio.slice(1));
      }

      toast.success("Archivo subido con éxito");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al subir archivo";
      toast.error(msg);
    } finally {
      setSubiendoArchivo(false);
    }
  };

  const handleSubmit = async (values: ITeacherMaterialFormValues) => {
    if (modo === "archivo" && !values.storagePath) {
      toast.error("Por favor selecciona y sube un archivo");
      return;
    }

    if (modo === "enlace" && !values.urlExterna) {
      toast.error("Por favor ingresa un enlace web");
      return;
    }

    try {
      await createMutation.mutateAsync(values);
      toast.success("Material compartido exitosamente");
      handleOpenChange(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al compartir material";
      toast.error(msg);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Subir Material de Clase</AlertDialogTitle>
          <AlertDialogDescription>
            Comparte partituras, PDFs, audios o enlaces con tus alumnos o la comunidad docente.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex gap-2 border-b border-border/50 pb-3">
          <Button
            type="button"
            variant={modo === "archivo" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setModo("archivo");
              form.setValue("urlExterna", "");
            }}
            className="flex-1 text-xs"
          >
            <Icon icon="ph:file-arrow-up" className="size-4" />
            Subir archivo
          </Button>
          <Button
            type="button"
            variant={modo === "enlace" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setModo("enlace");
              form.setValue("storagePath", "");
              setArchivoNombre(null);
            }}
            className="flex-1 text-xs"
          >
            <Icon icon="ph:link" className="size-4" />
            Enlace web
          </Button>
        </div>

        <Form form={form} onSubmit={handleSubmit} id="crear-material-form">
          <div className="space-y-3.5 py-2">
            <SelectField
              name="catedraId"
              label="Cátedra destino"
              placeholder="Selecciona cátedra"
              options={catedraOptions}
              required
            />

            {modo === "archivo" ? (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Archivo</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/20 p-4 text-center transition-colors hover:bg-muted/40"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                  />
                  <Icon
                    icon={subiendoArchivo ? "ph:spinner" : "ph:upload-simple"}
                    className={`size-6 text-primary ${subiendoArchivo ? "animate-spin" : ""}`}
                  />
                  <p className="mt-1 text-xs font-medium text-foreground">
                    {subiendoArchivo
                      ? "Subiendo archivo..."
                      : archivoNombre || "Haz clic para seleccionar archivo"}
                  </p>
                  <p className="text-[10px] text-muted-foreground">PDF, Partituras, Audio o Video</p>
                </div>
              </div>
            ) : (
              <TextField
                name="urlExterna"
                label="Enlace web"
                placeholder="https://ejemplo.com/material"
                required
              />
            )}

            <TextField
              name="titulo"
              label="Título del material"
              placeholder="Ej. Estudio Op. 29 No. 1"
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <SelectField
                name="tipo"
                label="Tipo de material"
                options={MATERIAL_TIPO_OPCIONES}
                required
              />
              <SelectField
                name="visibilidad"
                label="Visibilidad"
                options={MATERIAL_VISIBILIDAD_OPCIONES}
                required
              />
            </div>
          </div>
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button
            type="submit"
            form="crear-material-form"
            disabled={createMutation.isPending || subiendoArchivo}
          >
            Guardar Material
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
