"use client";

import { Icon } from "@iconify/react";

import {
  aprobarMatriculaFormSchema,
  getAprobarMatriculaFormDefaults,
  useAprobarMatricula,
  type IAprobarMatriculaFormValues,
} from "@/entities/matricula";
import { Form, NumberField, TextField, useAppForm } from "@/shared/form";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  Button,
  DataLabel,
  Spinner,
} from "@/shared/ui";
import { formatDate, initialsOf } from "@/shared/lib/formatters";

import type { IAprobarMatriculaDialogProps } from "./AprobarMatriculaDialog.types";

export default function AprobarMatriculaDialog({ inscripcion, onClose }: IAprobarMatriculaDialogProps) {
  const mutation = useAprobarMatricula();
  const open = inscripcion !== null;

  const form = useAppForm<IAprobarMatriculaFormValues>({
    schema: aprobarMatriculaFormSchema,
    values: {
      ...getAprobarMatriculaFormDefaults(),
      inscripcionId: inscripcion?.id ?? "",
      diaCobro: 5,
    },
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });

  const onSubmit = (values: IAprobarMatriculaFormValues) => {
    mutation.mutate(values, { onSuccess: onClose });
  };

  return (
    <AlertDialog open={open} onOpenChange={(next) => (next ? null : onClose())}>
      <AlertDialogContent size="xl" className="w-full p-6 sm:p-7">
        <AlertDialogHeader>
          <AlertDialogMedia className="rounded-xl bg-success-tint text-success-fg">
            <Icon icon="ph:seal-check" aria-hidden="true" />
          </AlertDialogMedia>
          <AlertDialogTitle>Aprobar matrícula</AlertDialogTitle>
          <AlertDialogDescription>
            Define el cobro mensual para activar esta inscripción.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {inscripcion ? (
          <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-card p-3.5 sm:p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-warning-tint text-xs font-extrabold text-warning-fg">
              {initialsOf(inscripcion.estudiante)}
            </span>
            <div className="min-w-0">
              <DataLabel>Inscripción seleccionada</DataLabel>
              <p className="mt-0.5 truncate text-sm font-bold text-foreground">
                {inscripcion.estudiante}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {inscripcion.cursoNombre ?? "Cátedra"}
                {inscripcion.catedraCodigo ? ` · ${inscripcion.catedraCodigo}` : ""}
                {` · inicia ${formatDate(inscripcion.fechaInicio)}`}
              </p>
            </div>
          </div>
        ) : null}

        <Form form={form} onSubmit={onSubmit} id="aprobar-matricula" className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <NumberField
              name="montoMensual"
              label="Monto mensual a cobrar"
              placeholder="0.00"
              integerOnly={false}
              asNumber
              startIcon={<Icon icon="ph:currency-dollar" className="size-4" aria-hidden="true" />}
            />
            <NumberField name="diaCobro" label="Día de cobro mensual" placeholder="1–28" asNumber />
          </div>
          <TextField name="motivoAjuste" label="Motivo de ajuste o beca (opcional)" />
          <p className="rounded-lg border border-success-border bg-success-tint px-3.5 py-2.5 text-[12px] leading-relaxed text-success-fg">
            Al confirmar, la matrícula pasa a estado <strong>activa</strong> y se generará la primera
            cuota automáticamente.
          </p>
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button form="aprobar-matricula" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            Confirmar aprobación
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
