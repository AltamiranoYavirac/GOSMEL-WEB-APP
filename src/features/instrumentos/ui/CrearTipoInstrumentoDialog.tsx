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
import { Form, NumberField, SwitchField, TextField, useAppForm } from "@/shared/form";

import { useCrearTipoInstrumento } from "../hooks/useTiposInstrumento";
import {
  getTipoInstrumentoFormDefaults,
  tipoInstrumentoFormSchema,
  type ITipoInstrumentoFormValues,
} from "../model/TipoInstrumentoForm.config";
import type { ICrearTipoInstrumentoDialogProps } from "./CrearTipoInstrumentoDialog.types";

export default function CrearTipoInstrumentoDialog({ onSuccess }: ICrearTipoInstrumentoDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useCrearTipoInstrumento();

  const form = useAppForm<ITipoInstrumentoFormValues>({
    schema: tipoInstrumentoFormSchema,
    defaultValues: getTipoInstrumentoFormDefaults(),
  });

  const onSubmit = (values: ITipoInstrumentoFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        form.reset(getTipoInstrumentoFormDefaults());
        setOpen(false);
        onSuccess?.();
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Icon icon="ph:folder-plus" aria-hidden="true" />
          Nueva familia
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Nueva familia de instrumentos</AlertDialogTitle>
          <AlertDialogDescription>Ej. Cuerdas, Viento madera, Percusión, Teclado.</AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id="crear-tipo-instrumento" className="flex flex-col gap-4">
          <TextField name="nombre" label="Nombre de la familia" placeholder="Ej. Viento metal" />
          <NumberField name="orden" label="Orden" asNumber />
          <SwitchField name="activo" label="Familia activa" />
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button form="crear-tipo-instrumento" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            Guardar familia
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
