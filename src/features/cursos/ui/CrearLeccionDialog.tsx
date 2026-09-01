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

import { useCrearLeccion } from "../hooks/useCrearLeccion";
import {
  getLeccionFormDefaults,
  leccionFormSchema,
  type ILeccionFormValues,
} from "../model/LeccionForm.config";
import type { ICrearLeccionDialogProps } from "./CrearLeccionDialog.types";

export default function CrearLeccionDialog({ cursoId, moduloId, nextOrden = 0 }: ICrearLeccionDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useCrearLeccion(cursoId);
  const form = useAppForm<ILeccionFormValues>({
    schema: leccionFormSchema,
    defaultValues: getLeccionFormDefaults({ orden: nextOrden }),
  });

  const onSubmit = (values: ILeccionFormValues) => {
    mutation.mutate(
      { moduloId, values },
      {
        onSuccess: () => {
          form.reset(getLeccionFormDefaults({ orden: nextOrden + 1 }));
          setOpen(false);
        },
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="xs" variant="ghost" className="h-7 text-xs">
          <Icon icon="ph:plus" aria-hidden="true" />
          Lección
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <AlertDialogHeader>
          <AlertDialogTitle>Nueva lección</AlertDialogTitle>
          <AlertDialogDescription>Agrega una lección o tema dentro de este módulo.</AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id={`crear-leccion-${moduloId}`} className="flex flex-col gap-4">
          <TextField name="titulo" label="Título de la lección" placeholder="Ej. Ejercicios de digitación I" />
          <TextareaField name="descripcion" label="Descripción (opcional)" placeholder="Contenido o instrucciones de la lección..." />
          <div className="grid grid-cols-2 gap-3">
            <NumberField name="duracionMinutos" label="Duración (min)" placeholder="45" asNumber />
            <NumberField name="orden" label="Orden" asNumber />
          </div>
          <SwitchField name="esMuestra" label="Lección de muestra (pública)" />
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button form={`crear-leccion-${moduloId}`} type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            Guardar lección
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
