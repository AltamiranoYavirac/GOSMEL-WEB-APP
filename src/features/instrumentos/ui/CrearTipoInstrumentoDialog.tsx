"use client";

import { useMemo, useState } from "react";
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

import { useCrearTipoInstrumento, useTiposInstrumento } from "../hooks/useTiposInstrumento";
import {
  getTipoInstrumentoFormDefaults,
  tipoInstrumentoFormSchema,
  type ITipoInstrumentoFormValues,
} from "../model/TipoInstrumentoForm.config";
import type { ICrearTipoInstrumentoDialogProps } from "./CrearTipoInstrumentoDialog.types";

export default function CrearTipoInstrumentoDialog({
  onSuccess,
  open: controlledOpen,
  onOpenChange,
  hideTrigger = false,
}: ICrearTipoInstrumentoDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const mutation = useCrearTipoInstrumento();
  const tipos = useTiposInstrumento();
  const nextOrden = Math.max(0, ...(tipos.data ?? []).map((tipo) => tipo.orden)) + 1;
  const formValues = useMemo(
    () => getTipoInstrumentoFormDefaults({ orden: nextOrden }),
    [nextOrden],
  );

  const form = useAppForm<ITipoInstrumentoFormValues>({
    schema: tipoInstrumentoFormSchema,
    values: formValues,
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });

  const setOpen = (nextOpen: boolean) => {
    if (nextOpen) form.reset(formValues);
    if (controlledOpen === undefined) setInternalOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  const onSubmit = (values: ITipoInstrumentoFormValues) => {
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
      {!hideTrigger ? (
        <AlertDialogTrigger asChild>
          <Button size="sm" variant="outline">
            <Icon icon="ph:folder-plus" aria-hidden="true" />
            Nueva familia
          </Button>
        </AlertDialogTrigger>
      ) : null}

      <AlertDialogContent className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <AlertDialogHeader>
          <AlertDialogTitle>Nueva familia de instrumentos</AlertDialogTitle>
          <AlertDialogDescription>Ej. Cuerdas, Viento madera, Percusión, Teclado.</AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id="crear-tipo-instrumento" className="flex flex-col gap-4">
          <TextField name="nombre" label="Nombre de la familia" placeholder="Ej. Viento metal" />
          <NumberField name="orden" label="Orden" hint="Se sugiere la siguiente posición disponible." asNumber />
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
