"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

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
import { Form, NumberField, SwitchField, TextareaField, TextField, useAppForm } from "@/shared/form";

import { useUpdateLeccion } from "../hooks/useUpdateLeccion";
import { useEliminarLeccion } from "../hooks/useEliminarLeccion";
import {
  getLeccionFormDefaults,
  leccionFormSchema,
  type ILeccionFormValues,
} from "../model/LeccionForm.config";
import type { IEditarLeccionDialogProps } from "./EditarLeccionDialog.types";

export default function EditarLeccionDialog({ cursoId, leccion }: IEditarLeccionDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useUpdateLeccion(cursoId);
  const eliminar = useEliminarLeccion(cursoId);
  const form = useAppForm<ILeccionFormValues>({
    schema: leccionFormSchema,
    defaultValues: getLeccionFormDefaults({
      titulo: leccion.titulo,
      descripcion: leccion.descripcion ?? "",
      duracionMinutos: leccion.duracionMinutos ?? undefined,
      esMuestra: leccion.esMuestra ?? false,
      orden: leccion.orden ?? 0,
    }),
  });

  const onSubmit = (values: ILeccionFormValues) => {
    mutation.mutate(
      { leccionId: leccion.id, values },
      {
        onSuccess: () => setOpen(false),
      }
    );
  };

  const onEliminar = () => {
    eliminar.mutate(leccion.id, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="icon-xs" variant="ghost" className="size-6 text-muted-foreground hover:text-foreground">
          <Icon icon="ph:pencil-simple" className="size-3" aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Editar lección</AlertDialogTitle>
          <AlertDialogDescription>Modifica los detalles de la lección seleccionada.</AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id={`editar-leccion-${leccion.id}`} className="flex flex-col gap-4">
          <TextField name="titulo" label="Título de la lección" />
          <TextareaField name="descripcion" label="Descripción (opcional)" />
          <div className="grid grid-cols-2 gap-3">
            <NumberField name="duracionMinutos" label="Duración (min)" asNumber />
            <NumberField name="orden" label="Orden" asNumber />
          </div>
          <SwitchField name="esMuestra" label="Lección de muestra (pública)" />
        </Form>

        <AlertDialogFooter className="justify-between sm:justify-between">
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onEliminar}
            disabled={eliminar.isPending || mutation.isPending}
          >
            {eliminar.isPending ? <Spinner className="size-3.5" /> : <Icon icon="ph:trash" aria-hidden="true" />}
            Eliminar
          </Button>
          <div className="flex items-center gap-2">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <Button
              form={`editar-leccion-${leccion.id}`}
              type="submit"
              disabled={mutation.isPending || eliminar.isPending}
            >
              {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
              Guardar
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
