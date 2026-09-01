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
import { Form, SelectField, useAppForm } from "@/shared/form";

import { useGenerarCuotasMes } from "../hooks/useGenerarCuotasMes";
import {
  generarCuotasFormSchema,
  getGenerarCuotasFormDefaults,
  getMonthOptions,
  type IGenerarCuotasFormValues,
} from "../model/GenerarCuotasForm.config";

export default function GenerarCuotasDialog() {
  const [open, setOpen] = useState(false);
  const mutation = useGenerarCuotasMes();
  const form = useAppForm<IGenerarCuotasFormValues>({
    schema: generarCuotasFormSchema,
    values: getGenerarCuotasFormDefaults(),
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      form.reset(getGenerarCuotasFormDefaults());
    }
  };

  const onSubmit = (values: IGenerarCuotasFormValues) => {
    mutation.mutate(values.mes, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button>
          <Icon icon="ph:plus" aria-hidden="true" />
          Generar cuotas
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <AlertDialogHeader>
          <AlertDialogTitle>Generar cuotas del mes</AlertDialogTitle>
          <AlertDialogDescription>
            Se crean las cuotas del mes seleccionado a partir de los acuerdos de pago vigentes.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id="generar-cuotas" className="flex flex-col gap-4">
          <SelectField name="mes" label="Mes" placeholder="Seleccione un mes" options={getMonthOptions()} />
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button form="generar-cuotas" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            Generar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}