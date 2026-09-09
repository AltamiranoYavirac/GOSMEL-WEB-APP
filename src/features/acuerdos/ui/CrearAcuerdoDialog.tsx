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
import { useEstudianteOptions } from "@/entities/estudiante";

import { useCrearAcuerdo } from "../hooks/useCrearAcuerdo";
import {
  crearAcuerdoFormSchema,
  getCrearAcuerdoFormDefaults,
  type ICrearAcuerdoFormValues,
} from "../model/CrearAcuerdoForm.config";

export default function CrearAcuerdoDialog() {
  const [open, setOpen] = useState(false);
  const { data: estudiantes = [], isLoading: loadingOptions } = useEstudianteOptions(open);

  const mutation = useCrearAcuerdo();

  const form = useAppForm<ICrearAcuerdoFormValues>({
    schema: crearAcuerdoFormSchema,
    values: getCrearAcuerdoFormDefaults(),
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });

  const onSubmit = (values: ICrearAcuerdoFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button>
          <Icon icon="ph:plus" aria-hidden="true" />
          Nuevo acuerdo
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-full max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <AlertDialogHeader>
          <AlertDialogTitle>Nuevo acuerdo de pago</AlertDialogTitle>
          <AlertDialogDescription>
            Pacta una mensualidad personalizada y condiciones de cobro para un estudiante.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id="crear-acuerdo" className="flex flex-col gap-4">
          <SelectField
            name="estudianteId"
            label="Estudiante"
            placeholder={loadingOptions ? "Cargando estudiantes..." : "Selecciona un estudiante"}
            options={estudiantes}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <NumberField
              name="montoMensual"
              label="Mensualidad acordada ($)"
              asNumber
              integerOnly={false}
              startIcon={<Icon icon="ph:currency-dollar" className="size-4" aria-hidden="true" />}
            />
            <NumberField name="diaCobro" label="Día de cobro (1–28)" asNumber />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DateField name="fechaInicio" label="Fecha de inicio" />
            <DateField name="fechaFin" label="Fecha fin (opcional)" />
          </div>

          <TextField
            name="motivoAjuste"
            label="Motivo de ajuste / beca (Confidencial Admin)"
            placeholder="Ej. Beca parcial 20%, descuento de hermanos, etc."
          />
          <TextareaField name="observaciones" label="Observaciones administrativas (opcional)" rows={2} />
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button form="crear-acuerdo" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            Guardar acuerdo
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
