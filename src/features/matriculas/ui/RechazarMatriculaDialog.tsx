"use client";

import { Icon } from "@iconify/react";

import {
  getRechazarMatriculaFormDefaults,
  rechazarMatriculaFormSchema,
  useRechazarMatricula,
  type IRechazarMatriculaFormValues,
} from "@/entities/matricula";
import { Form, TextareaField, useAppForm } from "@/shared/form";
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

import type { IRechazarMatriculaDialogProps } from "./RechazarMatriculaDialog.types";

export default function RechazarMatriculaDialog({ inscripcion, onClose }: IRechazarMatriculaDialogProps) {
  const mutation = useRechazarMatricula();
  const open = inscripcion !== null;

  const form = useAppForm<IRechazarMatriculaFormValues>({
    schema: rechazarMatriculaFormSchema,
    values: getRechazarMatriculaFormDefaults(),
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });

  const onSubmit = (values: IRechazarMatriculaFormValues) => {
    if (!inscripcion) return;
    mutation.mutate({ inscripcionId: inscripcion.id, motivo: values.motivo }, { onSuccess: onClose });
  };

  return (
    <AlertDialog open={open} onOpenChange={(next) => (next ? null : onClose())}>
      <AlertDialogContent className="w-full max-w-md p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-danger-tint text-danger-fg">
              <Icon icon="ph:x" aria-hidden="true" />
            </span>
            Rechazar matrícula
          </AlertDialogTitle>
          <AlertDialogDescription>
            {inscripcion?.estudiante} · {inscripcion?.cursoNombre ?? inscripcion?.catedraCodigo ?? "Cátedra"}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id="rechazar-matricula" className="flex flex-col gap-4">
          <p className="rounded-lg border border-danger-border bg-danger-tint px-3.5 py-2.5 text-[12px] leading-relaxed text-danger-fg">
            Esta acción es definitiva. El estudiante y quien solicitó la matrícula serán notificados con el
            motivo.
          </p>
          <TextareaField name="motivo" label="Motivo del rechazo" placeholder="Ej: No hay cupo disponible en el horario solicitado…" />
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button form="rechazar-matricula" type="submit" variant="destructive" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:x" aria-hidden="true" />}
            Confirmar rechazo
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
