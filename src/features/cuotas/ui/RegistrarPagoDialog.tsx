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
import { formatCurrency } from "@/shared/lib/formatters";

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
    monto?: number;
    periodo?: string;
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

  const montoIngresado = form.watch("monto") || 0;
  const saldoRestante = Math.max(0, cuota.saldo - montoIngresado);
  const esAbonoParcial = montoIngresado > 0 && montoIngresado < cuota.saldo;

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

      <AlertDialogContent className="w-full max-w-xl sm:max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <AlertDialogHeader>
          <AlertDialogTitle>Registrar cobro / pago</AlertDialogTitle>
          <AlertDialogDescription>
            {cuota.estudiante}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="rounded-xl border border-border/70 bg-card p-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Saldo pendiente actual:</span>
            <span className="text-base font-bold text-destructive">{formatCurrency(cuota.saldo)}</span>
          </div>

          {esAbonoParcial && (
            <div className="flex items-center justify-between text-sm pt-2 border-t border-border/50 text-amber-600 dark:text-amber-400">
              <span>Saldo que quedará pendiente (Abono):</span>
              <span className="font-bold">{formatCurrency(saldoRestante)}</span>
            </div>
          )}

          {montoIngresado >= cuota.saldo && (
            <div className="flex items-center justify-between text-sm pt-2 border-t border-border/50 text-emerald-600 dark:text-emerald-400">
              <span>Estado resultante:</span>
              <span className="font-bold">Liquidación total (Pagada al 100%)</span>
            </div>
          )}
        </div>

        <Form form={form} onSubmit={onSubmit} id={`registrar-pago-${cuota.id}`} className="flex flex-col gap-4">
          <NumberField
            name="monto"
            label="Monto recibido / cobrado ($)"
            placeholder="0.00"
            integerOnly={false}
            asNumber
            startIcon={<Icon icon="ph:currency-dollar" className="size-4" aria-hidden="true" />}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <SelectField name="metodo" label="Método de pago" options={METODO_PAGO_OPCIONES} />
            <DateField name="fechaPago" label="Fecha de pago" />
          </div>
          <TextField name="referencia" label="Número de referencia / comprobante (opcional)" />
          <TextareaField name="observacion" label="Observación o nota (opcional)" rows={2} />
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button form={`registrar-pago-${cuota.id}`} type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            {esAbonoParcial ? "Registrar abono parcial" : "Registrar pago"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}