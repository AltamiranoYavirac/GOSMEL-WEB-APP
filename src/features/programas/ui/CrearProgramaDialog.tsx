"use client";

import { useMemo, useState } from "react";
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

import { useCrearPrograma } from "../hooks/useCrearPrograma";
import { useProgramas } from "../hooks/useProgramas";
import {
  getProgramaFormDefaults,
  NIVEL_PROGRAMA_OPCIONES,
  programaFormSchema,
  type IProgramaFormValues,
} from "../model/ProgramaForm.config";
import type { ICrearProgramaDialogProps } from "./CrearProgramaDialog.types";

export default function CrearProgramaDialog({ onSuccess }: ICrearProgramaDialogProps) {
  const [open, setInternalOpen] = useState(false);
  const mutation = useCrearPrograma();
  const programas = useProgramas();
  const nextOrden = Math.max(0, ...(programas.data ?? []).map((programa) => programa.orden)) + 1;
  const formValues = useMemo(() => getProgramaFormDefaults({ orden: nextOrden }), [nextOrden]);
  const form = useAppForm<IProgramaFormValues>({
    schema: programaFormSchema,
    values: formValues,
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });
  const imagenArchivo = form.watch("imagenArchivo");

  const setOpen = (nextOpen: boolean) => {
    if (nextOpen) form.reset(formValues);
    setInternalOpen(nextOpen);
  };

  const onSubmit = (values: IProgramaFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        form.reset(formValues);
        setOpen(false);
        onSuccess?.();
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="sm">
          <Icon icon="ph:plus" aria-hidden="true" />
          Nuevo programa
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6 sm:max-w-3xl sm:p-8">
        <AlertDialogHeader>
          <AlertDialogTitle>Nuevo programa formativo</AlertDialogTitle>
          <AlertDialogDescription>Crea una ruta formativa que agrupe varios cursos.</AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id="crear-programa" className="flex flex-col gap-4">
          <ImageUploadField
            label="Imagen pública del programa"
            file={imagenArchivo}
            onFileChange={(file) => form.setValue("imagenArchivo", file, { shouldDirty: true })}
            onRemove={() => form.setValue("imagenArchivo", null, { shouldDirty: true })}
            disabled={mutation.isPending}
          />
          <TextField name="imagenTextoAlt" label="Texto alternativo de la imagen" />
          <TextField name="nombre" label="Nombre del programa" placeholder="Ej. Programa Integral de Piano" required />
          <SelectField name="nivel" label="Nivel" placeholder="Seleccionar nivel" options={NIVEL_PROGRAMA_OPCIONES} />
          <TextareaField name="descripcion" label="Descripción" placeholder="Resumen del programa formativo…" />
          <div className="grid grid-cols-2 items-center gap-3">
            <NumberField name="orden" label="Orden" hint="Se sugiere la siguiente posición disponible." asNumber />
            <NumberField name="precioReferencial" label="Precio referencial" asNumber integerOnly={false} />
          </div>
          <TextField name="etiquetaPrecio" label="Etiqueta de precio" placeholder="Ej. $150 / mes por el programa completo" />
          <div className="flex flex-wrap items-center gap-5">
            <SwitchField name="publicado" label="Publicar en catálogo" />
            <SwitchField name="mostrarPrecio" label="Mostrar precio" />
          </div>
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>Cancelar</AlertDialogCancel>
          <Button form="crear-programa" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            Guardar programa
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
