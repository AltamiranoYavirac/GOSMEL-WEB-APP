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
import { DateField, Form, NumberField, SelectField, TextField, TextareaField, useAppForm } from "@/shared/form";

import { useRegistrarPago } from "../hooks/useRegistrarPago";
import {
  getRegistrarPagoFormDefaults,
  METODO_PAGO_OPCIONES,
  registrarPagoFormSchema,
  type IRegistrarPagoFormValues,
} from "../model/RegistrarPagoForm.config";

interface IRegistrarPagoDialogProps {
  cuota: {
    id: string;
    estudiante: string;
    saldo: number;
  };
}

export default function RegistrarPagoDialog({ cuota }: IRegistrarPagoDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useRegistrarPago();
  const form = useAppForm<IRegistrarPagoFormValues>({
    schema: registrarPagoFormSchema,
    values: getRegistrarPagoFormDefaults(cuota.saldo),
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      form.reset(getRegistrarPagoFormDefaults(cuota.saldo));
    }
  };

  const onSubmit = (values: IRegistrarPagoFormValues) => {
    mutation.mutate(
      { cuotaId: cuota.id, values },
      {
        onSuccess: () => setOpen(false),
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Icon icon="ph:currency-circle-dollar" aria-hidden="true" />
          Pagar
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Registrar pago</AlertDialogTitle>
          <AlertDialogDescription>{cuota.estudiante}</AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id={`registrar-pago-${cuota.id}`} className="flex flex-col gap-4">
          <NumberField
            name="monto"
            label="Monto"
            placeholder="0.00"
            integerOnly={false}
            asNumber
            startIcon={<Icon icon="ph:currency-dollar" className="size-4" aria-hidden="true" />}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <SelectField name="metodo" label="Método" options={METODO_PAGO_OPCIONES} />
            <DateField name="fechaPago" label="Fecha" />
          </div>
          <TextField name="referencia" label="Referencia (opcional)" />
          <TextareaField name="observacion" label="Observación (opcional)" rows={2} />
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button form={`registrar-pago-${cuota.id}`} type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            Registrar pago
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}