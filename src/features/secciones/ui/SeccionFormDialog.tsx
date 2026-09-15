"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

import { Form, NumberField, SwitchField, TextField, TextareaField, useAppForm } from "@/shared/form";
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
  ImageUploadField,
  Spinner,
} from "@/shared/ui";

import { useActualizarSeccion } from "../hooks/useActualizarSeccion";
import { useCrearSeccion } from "../hooks/useCrearSeccion";
import {
  getSeccionFormDefaults,
  seccionFormSchema,
  type ISeccionFormValues,
} from "../model/SeccionForm.config";
import type { ISeccionFormDialogProps } from "./SeccionFormDialog.types";

export default function SeccionFormDialog({ item }: ISeccionFormDialogProps) {
  const [open, setOpen] = useState(false);
  const createMutation = useCrearSeccion();
  const updateMutation = useActualizarSeccion();
  const pending = createMutation.isPending || updateMutation.isPending;
  const form = useAppForm<ISeccionFormValues>({
    schema: seccionFormSchema,
    values: getSeccionFormDefaults(item),
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });
  const file = form.watch("file");
  const publicId = form.watch("publicId");

  const onSubmit = (values: ISeccionFormValues) => {
    const onSuccess = () => setOpen(false);
    if (item) updateMutation.mutate({ id: item.id, values, currentPublicId: item.imagenPublicId }, { onSuccess });
    else createMutation.mutate(values, { onSuccess });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {item ? (
          <Button variant="ghost" size="icon-xs" aria-label={`Editar sección ${item.titulo}`}>
            <Icon icon="ph:pencil-simple" aria-hidden="true" />
          </Button>
        ) : (
          <Button>
            <Icon icon="ph:plus" aria-hidden="true" />
            Nueva sección
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-h-[90vh] w-full max-w-2xl overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>{item ? "Editar sección" : "Nueva sección"}</AlertDialogTitle>
          <AlertDialogDescription>
            Bloque de contenido institucional que se muestra en la página Nosotros.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form form={form} onSubmit={onSubmit} id={`seccion-${item?.id ?? "nueva"}`} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField name="titulo" label="Título" required />
            <TextField name="clave" label="Clave" required hint="Identificador único, ej. mision" />
          </div>
          <TextareaField name="contenido" label="Contenido" rows={5} required />
          <ImageUploadField
            value={publicId}
            file={file}
            onFileChange={(nextFile) => {
              form.setValue("file", nextFile, { shouldDirty: true });
              if (nextFile) form.setValue("removeImage", false, { shouldDirty: true });
            }}
            onRemove={() => {
              form.setValue("publicId", "", { shouldDirty: true });
              form.setValue("removeImage", true, { shouldDirty: true });
            }}
            label="Imagen (opcional)"
            disabled={pending}
          />
          <TextField name="alt" label="Texto alternativo" hint="Requerido si hay imagen" />
          <div className="grid grid-cols-2 items-center gap-3">
            <NumberField name="orden" label="Orden" asNumber />
            <div className="pt-5">
              <SwitchField name="publicado" label="Publicado" />
            </div>
          </div>
        </Form>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancelar</AlertDialogCancel>
          <Button form={`seccion-${item?.id ?? "nueva"}`} type="submit" disabled={pending}>
            {pending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            Guardar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
