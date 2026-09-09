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
import { DateField, Form, NumberField, SelectField, useAppForm } from "@/shared/form";
import { useEstudianteOptions } from "@/entities/estudiante";

import { useCrearCuota } from "../hooks/useCrearCuota";
import { getMonthOptions } from "../model/GenerarCuotasForm.config";
import {
  crearCuotaFormSchema,
  getCrearCuotaFormDefaults,
  type ICrearCuotaFormValues,
} from "../model/CrearCuotaForm.config";

export default function CrearCuotaDialog() {
  const [open, setOpen] = useState(false);
  const { data: estudiantes = [], isLoading: loadingOptions } = useEstudianteOptions(open);

  const mutation = useCrearCuota();

  const form = useAppForm<ICrearCuotaFormValues>({
    schema: crearCuotaFormSchema,
    values: getCrearCuotaFormDefaults(),
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });

  const onSubmit = (values: ICrearCuotaFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <Icon icon="ph:receipt-bold" aria-hidden="true" />
          Nueva cuota manual
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-full max-w-xl sm:max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <AlertDialogHeader>
          <AlertDialogTitle>Crear cuota manual / extraordinaria</AlertDialogTitle>
          <AlertDialogDescription>
            Registra una cuota individual para un estudiante (ej. mensualidad especial, matrícula tardía o materiales).
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id="crear-cuota-manual" className="flex flex-col gap-4">
          <SelectField
            name="estudianteId"
            label="Estudiante"
            placeholder={loadingOptions ? "Cargando estudiantes..." : "Selecciona un estudiante"}
            options={estudiantes}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <NumberField
              name="monto"
              label="Monto a cobrar ($)"
              asNumber
              integerOnly={false}
              startIcon={<Icon icon="ph:currency-dollar" className="size-4" aria-hidden="true" />}
            />
            <SelectField name="periodo" label="Período" options={getMonthOptions()} />
          </div>

          <DateField name="fechaVencimiento" label="Fecha de vencimiento" />
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button form="crear-cuota-manual" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            Crear cuota
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
