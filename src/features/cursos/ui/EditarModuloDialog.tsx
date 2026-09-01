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
import { Form, NumberField, TextareaField, TextField, useAppForm } from "@/shared/form";

import { useUpdateModulo } from "../hooks/useUpdateModulo";
import { useEliminarModulo } from "../hooks/useEliminarModulo";
import {
  getModuloFormDefaults,
  moduloFormSchema,
  type IModuloFormValues,
} from "../model/ModuloForm.config";
import type { IEditarModuloDialogProps } from "./EditarModuloDialog.types";

export default function EditarModuloDialog({ cursoId, modulo }: IEditarModuloDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useUpdateModulo(cursoId);
  const eliminar = useEliminarModulo(cursoId);
  const form = useAppForm<IModuloFormValues>({
    schema: moduloFormSchema,
    defaultValues: getModuloFormDefaults({
      titulo: modulo.titulo,
      descripcion: modulo.descripcion ?? "",
      orden: modulo.orden ?? 0,
    }),
  });

  const onSubmit = (values: IModuloFormValues) => {
    mutation.mutate(
      { moduloId: modulo.id, values },
      {
        onSuccess: () => setOpen(false),
      }
    );
  };

  const onEliminar = () => {
    eliminar.mutate(modulo.id, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="icon-xs" variant="ghost" aria-label={`Editar módulo ${modulo.titulo}`}>
          <Icon icon="ph:pencil-simple" className="size-3.5" aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <AlertDialogHeader>
          <AlertDialogTitle>Editar módulo</AlertDialogTitle>
          <AlertDialogDescription>Actualiza el título o descripción del bloque.</AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id={`editar-modulo-${modulo.id}`} className="flex flex-col gap-4">
          <TextField name="titulo" label="Título del módulo" />
          <TextareaField name="descripcion" label="Descripción (opcional)" />
          <NumberField name="orden" label="Orden" asNumber />
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
              form={`editar-modulo-${modulo.id}`}
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
