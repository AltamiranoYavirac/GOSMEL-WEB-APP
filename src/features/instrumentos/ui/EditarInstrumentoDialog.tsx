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

import { useUpdateInstrumento, useEliminarInstrumento } from "../hooks/useCrearInstrumento";
import { useTiposInstrumento } from "../hooks/useTiposInstrumento";
import {
  getInstrumentoFormDefaults,
  instrumentoFormSchema,
  type IInstrumentoFormValues,
} from "../model/InstrumentoForm.config";
import type { IEditarInstrumentoDialogProps } from "./EditarInstrumentoDialog.types";

export default function EditarInstrumentoDialog({ instrumento }: IEditarInstrumentoDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useUpdateInstrumento();
  const eliminar = useEliminarInstrumento();
  const tipos = useTiposInstrumento();

  const form = useAppForm<IInstrumentoFormValues>({
    schema: instrumentoFormSchema,
    values: getInstrumentoFormDefaults({
      nombre: instrumento.nombre,
      tipoInstrumentoId: instrumento.tipoInstrumentoId,
      icono: instrumento.icono ?? "",
      orden: instrumento.orden,
      activo: instrumento.activo,
    }),
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });

  const onSubmit = (values: IInstrumentoFormValues) => {
    mutation.mutate(
      { instrumentoId: instrumento.id, values },
      {
        onSuccess: () => setOpen(false),
      }
    );
  };

  const onEliminar = () => {
    eliminar.mutate(instrumento.id, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="icon-xs" variant="ghost" aria-label={`Editar ${instrumento.nombre}`}>
          <Icon icon="ph:pencil-simple" className="size-4" aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Editar instrumento</AlertDialogTitle>
          <AlertDialogDescription>{instrumento.nombre}</AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id={`editar-instrumento-${instrumento.id}`} className="flex flex-col gap-4">
          <TextField name="nombre" label="Nombre del instrumento" />
          <SelectField
            name="tipoInstrumentoId"
            label="Familia de instrumento"
            placeholder="Seleccionar familia"
            options={(tipos.data ?? []).map((t) => ({ value: t.id, label: t.nombre }))}
          />
          <TextField name="icono" label="Icono Iconify (opcional)" />
          <div className="grid grid-cols-2 items-center gap-3">
            <NumberField name="orden" label="Orden" asNumber />
            <div className="pt-5">
              <SwitchField name="activo" label="Instrumento activo" />
            </div>
          </div>
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
              form={`editar-instrumento-${instrumento.id}`}
              type="submit"
              disabled={mutation.isPending || eliminar.isPending}
            >
              {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
              Guardar cambios
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
