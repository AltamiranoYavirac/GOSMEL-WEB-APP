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

import { useCrearModulo } from "../hooks/useCrearModulo";
import {
  getModuloFormDefaults,
  moduloFormSchema,
  type IModuloFormValues,
} from "../model/ModuloForm.config";
import type { ICrearModuloDialogProps } from "./CrearModuloDialog.types";

export default function CrearModuloDialog({ cursoId, nextOrden = 0 }: ICrearModuloDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useCrearModulo(cursoId);
  const form = useAppForm<IModuloFormValues>({
    schema: moduloFormSchema,
    defaultValues: getModuloFormDefaults({ orden: nextOrden }),
  });

  const onSubmit = (values: IModuloFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        form.reset(getModuloFormDefaults({ orden: nextOrden + 1 }));
        setOpen(false);
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="xs" variant="outline">
          <Icon icon="ph:plus" aria-hidden="true" />
          Módulo
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <AlertDialogHeader>
          <AlertDialogTitle>Nuevo módulo</AlertDialogTitle>
          <AlertDialogDescription>Agrega un bloque temático al temario del curso.</AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id="crear-modulo" className="flex flex-col gap-4">
          <TextField name="titulo" label="Título del módulo" placeholder="Ej. Fundamentos y postura" />
          <TextareaField name="descripcion" label="Descripción (opcional)" placeholder="Objetivos y temas generales..." />
          <NumberField name="orden" label="Orden" asNumber />
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button form="crear-modulo" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            Guardar módulo
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
