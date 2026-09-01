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

import { useCrearPrograma } from "../hooks/useCrearPrograma";
import { useProgramaOptions } from "../hooks/useProgramaOptions";
import {
  getProgramaFormDefaults,
  programaFormSchema,
  type IProgramaFormValues,
} from "../model/ProgramaForm.config";
import type { ICrearProgramaDialogProps } from "./CrearProgramaDialog.types";

const NIVEL_OPCIONES = [
  { value: "iniciacion", label: "Iniciación" },
  { value: "basico", label: "Básico" },
  { value: "intermedio", label: "Intermedio" },
  { value: "avanzado", label: "Avanzado" },
  { value: "maestria", label: "Maestría" },
];

export default function CrearProgramaDialog({ onSuccess }: ICrearProgramaDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useCrearPrograma();
  const options = useProgramaOptions(open);

  const form = useAppForm<IProgramaFormValues>({
    schema: programaFormSchema,
    defaultValues: getProgramaFormDefaults(),
  });

  const onSubmit = (values: IProgramaFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        form.reset(getProgramaFormDefaults());
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

      <AlertDialogContent className="w-full max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <AlertDialogHeader>
          <AlertDialogTitle>Nuevo programa formativo</AlertDialogTitle>
          <AlertDialogDescription>Crea un programa para agrupar cursos con una ruta formativa.</AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id="crear-programa" className="flex flex-col gap-4">
          <TextField name="nombre" label="Nombre del programa" placeholder="Ej. Programa Integral de Piano" />
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
          <TextareaField name="descripcion" label="Descripción" placeholder="Resumen del programa formativo..." />
          <TextareaField name="objetivos" label="Objetivos (opcional)" placeholder="Competencias que adquirirá el estudiante..." />
          <div className="grid grid-cols-2 items-center gap-3">
            <NumberField name="orden" label="Orden" asNumber />
            <div className="pt-5">
              <SwitchField name="publicado" label="Publicar en catálogo" />
            </div>
          </div>
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button form="crear-programa" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            Guardar programa
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
