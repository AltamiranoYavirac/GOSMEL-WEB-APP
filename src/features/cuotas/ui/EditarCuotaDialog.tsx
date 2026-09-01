"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { z } from "zod";

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
import { DateField, Form, NumberField, useAppForm } from "@/shared/form";
import { formatCurrency, formatMonthPeriod } from "@/shared/lib/formatters";

import { useUpdateCuota } from "../hooks/useUpdateCuota";
import type { ICuotaRow } from "../model/cuota.types";

const editarCuotaSchema = z.object({
  monto: z.coerce.number().positive("Ingresa un monto válido"),
  fechaVencimiento: z.string().min(1, "Selecciona la fecha de vencimiento"),
});

type TEditarCuotaValues = z.infer<typeof editarCuotaSchema>;

interface IEditarCuotaDialogProps {
  cuota: ICuotaRow;
}

export default function EditarCuotaDialog({ cuota }: IEditarCuotaDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useUpdateCuota();

  const form = useAppForm<TEditarCuotaValues>({
    schema: editarCuotaSchema,
    values: {
      monto: cuota.monto,
      fechaVencimiento: cuota.fechaVencimiento ?? "",
    },
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });

  const onSubmit = (values: TEditarCuotaValues) => {
    mutation.mutate(
      {
        cuotaId: cuota.id,
        monto: values.monto,
        fechaVencimiento: values.fechaVencimiento,
      },
      {
        onSuccess: () => setOpen(false),
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon-xs" aria-label={`Editar cuota de ${cuota.estudiante}`}>
          <Icon icon="ph:pencil-simple" className="size-4" aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <AlertDialogHeader>
          <AlertDialogTitle>Editar cuota</AlertDialogTitle>
          <AlertDialogDescription>
            {cuota.estudiante} · {formatMonthPeriod(cuota.periodo)} (Pagado: {formatCurrency(cuota.montoPagado)})
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id={`editar-cuota-${cuota.id}`} className="flex flex-col gap-4">
          <NumberField
            name="monto"
            label="Monto total de la cuota ($)"
            asNumber
            integerOnly={false}
            startIcon={<Icon icon="ph:currency-dollar" className="size-4" aria-hidden="true" />}
          />

          <DateField name="fechaVencimiento" label="Fecha de vencimiento" />
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button form={`editar-cuota-${cuota.id}`} type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            Guardar cambios
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
