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
  Button,
  Spinner,
} from "@/shared/ui";
import { DateField, Form, useAppForm } from "@/shared/form";

import { useGenerarSesionesCatedra } from "../hooks/useGenerarSesionesCatedra";
import {
  generarSesionesCatedraFormSchema,
  getGenerarSesionesCatedraFormDefaults,
  type IGenerarSesionesCatedraFormValues,
} from "../model/GenerarSesionesCatedraForm.config";
import type { IGenerarSesionesCatedraDialogProps } from "./GenerarSesionesCatedraDialog.types";

export default function GenerarSesionesCatedraDialog({
  catedra,
  open,
  onOpenChange,
  onSuccess,
}: IGenerarSesionesCatedraDialogProps) {
  const genMutation = useGenerarSesionesCatedra();

  const form = useAppForm<IGenerarSesionesCatedraFormValues>({
    schema: generarSesionesCatedraFormSchema,
    values: getGenerarSesionesCatedraFormDefaults(),
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
    if (next) {
      form.reset(getGenerarSesionesCatedraFormDefaults());
    }
  };

  if (!catedra) return null;

  const onSubmit = (values: IGenerarSesionesCatedraFormValues) => {
    genMutation.mutate(
      { catedraId: catedra.id, fechaDesde: values.fechaDesde, fechaHasta: values.fechaHasta },
      {
        onSuccess: () => {
          onOpenChange(false);
          if (onSuccess) onSuccess();
        },
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="w-full max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 text-primary">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Icon icon="ph:calendar-check" width={24} height={24} />
            </div>
            <div>
              <AlertDialogTitle className="text-xl font-bold">Generar Sesiones del Ciclo</AlertDialogTitle>
              <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Cátedra <strong>{catedra.codigo}</strong> ({catedra.curso}). Se generarán automáticamente las clases
                según los días y horas de su horario configurado.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id="generar-sesiones-catedra" className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DateField name="fechaDesde" label="Fecha de inicio del ciclo" required />
            <DateField name="fechaHasta" label="Fecha de fin del ciclo" required />
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/40 p-4 text-xs text-muted-foreground">
            <Icon icon="ph:info" width={20} height={20} className="shrink-0 text-primary" />
            <span>
              Las clases que ya existan en esas fechas no se duplicarán. Solo se añadirán las fechas faltantes del
              calendario.
            </span>
          </div>
        </Form>

        <AlertDialogFooter className="pt-2 gap-3">
          <AlertDialogCancel type="button" disabled={genMutation.isPending} className="h-10 px-5">
            Cancelar
          </AlertDialogCancel>
          <Button
            form="generar-sesiones-catedra"
            type="submit"
            disabled={genMutation.isPending}
            className="h-10 px-6 font-semibold"
          >
            {genMutation.isPending && <Spinner className="size-4 mr-2" />}
            Generar Calendario
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
