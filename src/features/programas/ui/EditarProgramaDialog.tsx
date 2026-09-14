"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

import { Form, NumberField, SelectField, SwitchField, TextareaField, TextField, useAppForm } from "@/shared/form";
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

import { useEliminarPrograma } from "../hooks/useEliminarPrograma";
import { useProgramaDetalle } from "../hooks/useProgramaDetalle";
import { useUpdatePrograma } from "../hooks/useUpdatePrograma";
import {
  getProgramaFormDefaults,
  mapProgramaToFormValues,
  NIVEL_PROGRAMA_OPCIONES,
  programaFormSchema,
  type IProgramaFormValues,
} from "../model/ProgramaForm.config";
import type { IEditarProgramaDialogProps } from "./EditarProgramaDialog.types";

export default function EditarProgramaDialog({ programa }: IEditarProgramaDialogProps) {
  const [open, setOpen] = useState(false);
  const detalle = useProgramaDetalle(programa.id, open);
  const mutation = useUpdatePrograma();
  const eliminar = useEliminarPrograma();
  const form = useAppForm<IProgramaFormValues>({
    schema: programaFormSchema,
    values: detalle.data
      ? mapProgramaToFormValues(detalle.data)
      : getProgramaFormDefaults({ nombre: programa.nombre, nivel: programa.nivel ?? undefined, publicado: programa.publicado }),
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });
  const imagenArchivo = form.watch("imagenArchivo");
  const imagenPublicId = form.watch("imagenPublicId");

  const onSubmit = (values: IProgramaFormValues) => {
    mutation.mutate(
      { programaId: programa.id, values, currentPublicId: detalle.data?.imagenPublicId },
      { onSuccess: () => setOpen(false) }
    );
  };

  const onEliminar = () => {
    eliminar.mutate(programa.id, { onSuccess: () => setOpen(false) });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="icon-xs" variant="ghost" aria-label={`Editar ${programa.nombre}`}>
          <Icon icon="ph:pencil-simple" className="size-4" aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6 sm:max-w-3xl sm:p-8">
        <AlertDialogHeader>
          <AlertDialogTitle>Editar programa formativo</AlertDialogTitle>
          <AlertDialogDescription>{programa.nombre}</AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id={`editar-programa-${programa.id}`} className="flex flex-col gap-4">
          <ImageUploadField
            label="Imagen pública del programa"
            value={imagenPublicId}
            file={imagenArchivo}
            onFileChange={(file) => {
              form.setValue("imagenArchivo", file, { shouldDirty: true });
              if (file) form.setValue("quitarImagen", false, { shouldDirty: true });
            }}
            onRemove={() => {
              form.setValue("imagenPublicId", "", { shouldDirty: true });
              form.setValue("quitarImagen", true, { shouldDirty: true });
            }}
            disabled={mutation.isPending}
          />
          <TextField name="imagenTextoAlt" label="Texto alternativo de la imagen" />
          <TextField name="nombre" label="Nombre del programa" required />
          <SelectField name="nivel" label="Nivel" placeholder="Seleccionar nivel" options={NIVEL_PROGRAMA_OPCIONES} />
          <TextareaField name="descripcion" label="Descripción" />
          <div className="grid grid-cols-2 items-center gap-3">
            <NumberField name="orden" label="Orden" asNumber />
            <NumberField name="precioReferencial" label="Precio referencial" asNumber integerOnly={false} />
          </div>
          <TextField name="etiquetaPrecio" label="Etiqueta de precio" placeholder="Ej. $150 / mes por el programa completo" />
          <div className="flex flex-wrap items-center gap-5">
            <SwitchField name="publicado" label="Publicar en catálogo" />
            <SwitchField name="mostrarPrecio" label="Mostrar precio" />
          </div>
        </Form>

        <AlertDialogFooter className="justify-between sm:justify-between">
          <Button type="button" variant="destructive" size="sm" onClick={onEliminar} disabled={eliminar.isPending || mutation.isPending}>
            {eliminar.isPending ? <Spinner className="size-3.5" /> : <Icon icon="ph:trash" aria-hidden="true" />}
            Eliminar
          </Button>
          <div className="flex items-center gap-2">
            <AlertDialogCancel disabled={mutation.isPending}>Cancelar</AlertDialogCancel>
            <Button form={`editar-programa-${programa.id}`} type="submit" disabled={mutation.isPending || eliminar.isPending}>
              {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
              Guardar cambios
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
