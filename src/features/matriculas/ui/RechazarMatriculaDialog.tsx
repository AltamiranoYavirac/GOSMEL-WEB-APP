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
  AlertDialogMedia,
  AlertDialogTitle,
  Button,
  DataLabel,
  Spinner,
} from "@/shared/ui";
import { formatDate, initialsOf } from "@/shared/lib/formatters";

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
      <AlertDialogContent size="xl" className="w-full p-6 sm:p-7">
        <AlertDialogHeader>
          <AlertDialogMedia className="rounded-xl bg-danger-tint text-danger-fg">
            <Icon icon="ph:prohibit" aria-hidden="true" />
          </AlertDialogMedia>
          <AlertDialogTitle>Rechazar matrícula</AlertDialogTitle>
          <AlertDialogDescription>
            La inscripción se descartará y se notificará el motivo.
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

        <Form form={form} onSubmit={onSubmit} id="rechazar-matricula" className="flex flex-col gap-4">
          <p className="rounded-lg border border-danger-border bg-danger-tint px-3.5 py-2.5 text-[12px] leading-relaxed text-danger-fg">
            Esta acción es definitiva. El estudiante y quien solicitó la matrícula serán notificados
            con el motivo.
          </p>
          <TextareaField
            name="motivo"
            label="Motivo del rechazo"
            placeholder="Ej: No hay cupo disponible en el horario solicitado…"
          />
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
