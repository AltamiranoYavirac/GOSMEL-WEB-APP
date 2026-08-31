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
import { Form, NumberField, SelectField, SwitchField, TextareaField, TextField, useAppForm } from "@/shared/form";

import { useUpdatePrograma } from "../hooks/useUpdatePrograma";
import { useEliminarPrograma } from "../hooks/useEliminarPrograma";
import { useProgramaDetalle } from "../hooks/useProgramaDetalle";
import { useProgramaOptions } from "../hooks/useProgramaOptions";
import {
  getProgramaFormDefaults,
  programaFormSchema,
  type IProgramaFormValues,
} from "../model/ProgramaForm.config";
import type { IEditarProgramaDialogProps } from "./EditarProgramaDialog.types";

const NIVEL_OPCIONES = [
  { value: "iniciacion", label: "Iniciación" },
  { value: "basico", label: "Básico" },
  { value: "intermedio", label: "Intermedio" },
  { value: "avanzado", label: "Avanzado" },
  { value: "maestria", label: "Maestría" },
];

export default function EditarProgramaDialog({ programa }: IEditarProgramaDialogProps) {
  const [open, setOpen] = useState(false);
  const detalle = useProgramaDetalle(programa.id, open);
  const mutation = useUpdatePrograma();
  const eliminar = useEliminarPrograma();
  const options = useProgramaOptions(open);

  const form = useAppForm<IProgramaFormValues>({
    schema: programaFormSchema,
    values: getProgramaFormDefaults({
      nombre: detalle.data?.nombre ?? programa.nombre,
      descripcion: detalle.data?.descripcion ?? "",
      objetivos: detalle.data?.objetivos ?? "",
      nivel: detalle.data?.nivel ?? programa.nivel ?? undefined,
      instrumentoId: detalle.data?.instrumentoId ?? undefined,
      publicado: detalle.data?.publicado ?? programa.publicado,
      orden: detalle.data?.orden ?? 0,
    }),
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });

  const onSubmit = (values: IProgramaFormValues) => {
    mutation.mutate(
      { programaId: programa.id, values },
      {
        onSuccess: () => setOpen(false),
      }
    );
  };

  const onEliminar = () => {
    eliminar.mutate(programa.id, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="icon-xs" variant="ghost" aria-label={`Editar ${programa.nombre}`}>
          <Icon icon="ph:pencil-simple" className="size-4" aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Editar programa formativo</AlertDialogTitle>
          <AlertDialogDescription>{programa.nombre}</AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id={`editar-programa-${programa.id}`} className="flex flex-col gap-4">
          <TextField name="nombre" label="Nombre del programa" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <SelectField
              name="nivel"
              label="Nivel"
              placeholder="Seleccionar nivel"
              options={NIVEL_OPCIONES}
            />
            <SelectField
              name="instrumentoId"
              label="Instrumento"
              placeholder="Seleccionar instrumento"
              options={(options.data?.instrumentos ?? []).map((i) => ({ value: i.id, label: i.nombre }))}
            />
          </div>
          <TextareaField name="descripcion" label="Descripción" />
          <TextareaField name="objetivos" label="Objetivos (opcional)" />
          <div className="grid grid-cols-2 items-center gap-3">
            <NumberField name="orden" label="Orden" asNumber />
            <div className="pt-5">
              <SwitchField name="publicado" label="Publicar en catálogo" />
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
              form={`editar-programa-${programa.id}`}
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
