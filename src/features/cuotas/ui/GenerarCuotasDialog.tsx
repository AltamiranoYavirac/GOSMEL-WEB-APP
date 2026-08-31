"use client";

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
  const mutation = useGenerarCuotasMes();
  const form = useAppForm<IGenerarCuotasFormValues>({
    schema: generarCuotasFormSchema,
    defaultValues: getGenerarCuotasFormDefaults(),
  });

  const onSubmit = (values: IGenerarCuotasFormValues) => {
    mutation.mutate(values.mes);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
          <Icon icon="ph:plus" aria-hidden="true" />
          Generar cuotas
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-sm">
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