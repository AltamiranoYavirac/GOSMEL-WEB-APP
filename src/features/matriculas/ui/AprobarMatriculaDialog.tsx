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
  AlertDialogTitle,
  Button,
  Spinner,
} from "@/shared/ui";

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
      <AlertDialogContent className="w-full max-w-md p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-success-tint text-success-fg">
              <Icon icon="ph:check" aria-hidden="true" />
            </span>
            Aprobar matrícula
          </AlertDialogTitle>
          <AlertDialogDescription>
            {inscripcion?.estudiante} · {inscripcion?.cursoNombre ?? inscripcion?.catedraCodigo ?? "Cátedra"}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id="aprobar-matricula" className="flex flex-col gap-4">
          <NumberField
            name="montoMensual"
            label="Monto mensual a cobrar"
            placeholder="0.00"
            integerOnly={false}
            asNumber
            startIcon={<Icon icon="ph:currency-dollar" className="size-4" aria-hidden="true" />}
          />
          <NumberField name="diaCobro" label="Día de cobro mensual" placeholder="1–28" asNumber />
          <TextField name="motivoAjuste" label="Motivo de ajuste o beca (opcional)" />
          <p className="rounded-lg border border-success-border bg-success-tint px-3.5 py-2.5 text-[12px] leading-relaxed text-success-fg">
            Al confirmar, la matrícula pasa a estado <strong>activa</strong> y se generará la primera cuota
            automáticamente.
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
