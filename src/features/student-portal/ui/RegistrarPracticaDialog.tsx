"use client";

import { Icon } from "@iconify/react";

import { Button, Spinner, AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/shared/ui";
import { DateField, Form, NumberField, SelectField, TextareaField, useAppForm } from "@/shared/form";

import { useCreatePracticeLog } from "../hooks/useCreatePracticeLog";
import {
  getRegistrarPracticaFormDefaults,
  registrarPracticaFormSchema,
  type IRegistrarPracticaFormValues,
} from "../model/RegistrarPracticaForm.config";
import type { IRegistrarPracticaDialogProps } from "./RegistrarPracticaDialog.types";

export default function RegistrarPracticaDialog({ estudianteId, inscripciones, open, onOpenChange }: IRegistrarPracticaDialogProps) {
  const mutation = useCreatePracticeLog(estudianteId);

  const form = useAppForm<IRegistrarPracticaFormValues>({
    schema: registrarPracticaFormSchema,
    values: getRegistrarPracticaFormDefaults(),
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });

  const handleOpenChange = (next: boolean) => {
    if (next) form.reset(getRegistrarPracticaFormDefaults());
    onOpenChange(next);
  };

  const onSubmit = (values: IRegistrarPracticaFormValues) => {
    mutation.mutate(values, { onSuccess: () => onOpenChange(false) });
  };

  const opciones = inscripciones
    .filter((item) => item.estado === "activa")
    .map((item) => ({ value: item.inscripcionId, label: `${item.curso} — ${item.codigo}` }));

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <AlertDialogHeader>
          <AlertDialogTitle>Registrar práctica</AlertDialogTitle>
          <AlertDialogDescription>Registra tu sesión de estudio en casa.</AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id="registrar-practica" className="flex flex-col gap-4">
          <SelectField name="inscripcionId" label="Cátedra / instrumento" options={opciones} placeholder="Selecciona la cátedra" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DateField name="fecha" label="Fecha" />
            <NumberField
              name="minutos"
              label="Minutos"
              asNumber
              startIcon={<Icon icon="ph:timer" className="size-4" aria-hidden="true" />}
            />
          </div>
          <TextareaField
            name="nota"
            label="Notas de la sesión (opcional)"
            rows={3}
            placeholder="Ej: escalas mayores con metrónomo a 85 bpm"
          />
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button form="registrar-practica" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            Guardar práctica
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}