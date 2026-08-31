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
import { DateField, Form, NumberField, SelectField, TextareaField, TextField, useAppForm } from "@/shared/form";

import { useCrearEvaluacion } from "../hooks/useCrearEvaluacion";
import { useCatedrasOptions } from "../hooks/useCatedrasOptions";
import {
  getEvaluacionFormDefaults,
  evaluacionFormSchema,
  TIPO_EVALUACION_OPCIONES,
  type IEvaluacionFormValues,
} from "../model/EvaluacionForm.config";
import type { ICrearEvaluacionDialogProps } from "./CrearEvaluacionDialog.types";

export default function CrearEvaluacionDialog({ onSuccess }: ICrearEvaluacionDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useCrearEvaluacion();
  const catedras = useCatedrasOptions(open);

  const form = useAppForm<IEvaluacionFormValues>({
    schema: evaluacionFormSchema,
    defaultValues: getEvaluacionFormDefaults(),
  });

  const onSubmit = (values: IEvaluacionFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        form.reset(getEvaluacionFormDefaults());
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
          Nueva evaluación
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Nueva evaluación</AlertDialogTitle>
          <AlertDialogDescription>Define un instrumento de evaluación y su ponderación porcentual.</AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id="crear-evaluacion" className="flex flex-col gap-4">
          <SelectField
            name="catedraId"
            label="Cátedra"
            placeholder="Seleccionar cátedra"
            options={(catedras.data ?? []).map((c) => ({ value: c.id, label: c.label }))}
          />
          <TextField name="titulo" label="Título de la evaluación" placeholder="Ej. Recital de mitad de ciclo" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <SelectField name="tipo" label="Tipo" options={TIPO_EVALUACION_OPCIONES} />
            <DateField name="fecha" label="Fecha" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <NumberField name="notaMaxima" label="Nota máxima" asNumber placeholder="10" />
            <NumberField name="ponderacion" label="Ponderación (%)" asNumber placeholder="20" />
          </div>
          <TextareaField name="descripcion" label="Descripción / Criterios (opcional)" />
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button form="crear-evaluacion" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            Guardar evaluación
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
