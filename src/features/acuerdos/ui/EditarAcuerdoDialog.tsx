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

import { useUpdateAcuerdo } from "../hooks/useUpdateAcuerdo";
import {
  ESTADO_ACUERDO_OPCIONES,
  getEditarAcuerdoFormDefaults,
  editarAcuerdoFormSchema,
  type IEditarAcuerdoFormValues,
} from "../model/EditarAcuerdoForm.config";
import type { IEditarAcuerdoDialogProps } from "./EditarAcuerdoDialog.types";

export default function EditarAcuerdoDialog({ acuerdo }: IEditarAcuerdoDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useUpdateAcuerdo();

  const form = useAppForm<IEditarAcuerdoFormValues>({
    schema: editarAcuerdoFormSchema,
    values: getEditarAcuerdoFormDefaults({
      montoMensual: acuerdo.montoMensual,
      diaCobro: acuerdo.diaCobro ?? 5,
      fechaFin: acuerdo.fechaFin ?? "",
      estado: acuerdo.estado,
      motivoAjuste: acuerdo.motivoAjuste ?? "",
      observaciones: acuerdo.observaciones ?? "",
    }),
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });

  const onSubmit = (values: IEditarAcuerdoFormValues) => {
    mutation.mutate(
      { acuerdoId: acuerdo.id, values },
      {
        onSuccess: () => setOpen(false),
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="icon-xs" variant="ghost" aria-label={`Editar acuerdo de ${acuerdo.estudiante}`}>
          <Icon icon="ph:pencil-simple" className="size-4" aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-full max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <AlertDialogHeader>
          <AlertDialogTitle>Editar acuerdo de pago</AlertDialogTitle>
          <AlertDialogDescription>
            {acuerdo.estudiante} {acuerdo.inscripcion ? `· ${acuerdo.inscripcion}` : ""}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id={`editar-acuerdo-${acuerdo.id}`} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <NumberField
              name="montoMensual"
              label="Monto mensual ($)"
              asNumber
              integerOnly={false}
              startIcon={<Icon icon="ph:currency-dollar" className="size-4" aria-hidden="true" />}
            />
            <NumberField name="diaCobro" label="Día de cobro (1–28)" asNumber />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <SelectField name="estado" label="Estado del acuerdo" options={ESTADO_ACUERDO_OPCIONES} />
            <DateField name="fechaFin" label="Fecha fin (opcional)" />
          </div>

          <TextField
            name="motivoAjuste"
            label="Motivo de ajuste / beca (Confidencial Admin)"
            placeholder="Ej. Descuento socioeconómico o beca parcial..."
          />
          <TextareaField name="observaciones" label="Observaciones administrativas" />
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button form={`editar-acuerdo-${acuerdo.id}`} type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            Guardar cambios
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
