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
import { Form, NumberField, SelectField, SwitchField, TextField, useAppForm } from "@/shared/form";

import { useCrearInstrumento } from "../hooks/useCrearInstrumento";
import { useTiposInstrumento } from "../hooks/useTiposInstrumento";
import {
  getInstrumentoFormDefaults,
  instrumentoFormSchema,
  type IInstrumentoFormValues,
} from "../model/InstrumentoForm.config";
import type { ICrearInstrumentoDialogProps } from "./CrearInstrumentoDialog.types";

export default function CrearInstrumentoDialog({ onSuccess }: ICrearInstrumentoDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useCrearInstrumento();
  const tipos = useTiposInstrumento();

  const form = useAppForm<IInstrumentoFormValues>({
    schema: instrumentoFormSchema,
    defaultValues: getInstrumentoFormDefaults(),
  });

  const onSubmit = (values: IInstrumentoFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        form.reset(getInstrumentoFormDefaults());
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
          Nuevo instrumento
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Nuevo instrumento</AlertDialogTitle>
          <AlertDialogDescription>Agrega un instrumento al catálogo de la academia.</AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id="crear-instrumento" className="flex flex-col gap-4">
          <TextField name="nombre" label="Nombre del instrumento" placeholder="Ej. Violonchelo" />
          <SelectField
            name="tipoInstrumentoId"
            label="Familia de instrumento"
            placeholder="Seleccionar familia"
            options={(tipos.data ?? []).map((t) => ({ value: t.id, label: t.nombre }))}
          />
          <TextField name="icono" label="Icono Iconify (opcional)" placeholder="ph:guitar o similar" />
          <div className="grid grid-cols-2 items-center gap-3">
            <NumberField name="orden" label="Orden" asNumber />
            <div className="pt-5">
              <SwitchField name="activo" label="Instrumento activo" />
            </div>
          </div>
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button form="crear-instrumento" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            Guardar instrumento
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
