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
  Skeleton,
  Spinner,
} from "@/shared/ui";
import { Form, NumberField, SelectField, TextField, useAppForm } from "@/shared/form";

import { useAprobarMatricula } from "../hooks/useAprobarMatricula";
import { useInscripcionesPendientes } from "../hooks/useInscripcionesPendientes";
import {
  aprobarMatriculaFormSchema,
  getAprobarMatriculaFormDefaults,
  type IAprobarMatriculaFormValues,
} from "../model/AprobarMatriculaForm.config";

interface ICatedraMatriculasDialogProps {
  catedraId: string;
  codigo: string;
  curso: string;
}

export default function CatedraMatriculasDialog({
  catedraId,
  codigo,
  curso,
}: ICatedraMatriculasDialogProps) {
  const [open, setOpen] = useState(false);
  const pendientes = useInscripcionesPendientes(catedraId, open);
  const mutation = useAprobarMatricula(catedraId);
  const form = useAppForm<IAprobarMatriculaFormValues>({
    schema: aprobarMatriculaFormSchema,
    defaultValues: getAprobarMatriculaFormDefaults(),
  });

  const onSubmit = (values: IAprobarMatriculaFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => form.reset(getAprobarMatriculaFormDefaults()),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Icon icon="ph:user-check" aria-hidden="true" />
          Aprobar
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <AlertDialogHeader>
          <AlertDialogTitle>Aprobar matrícula</AlertDialogTitle>
          <AlertDialogDescription>
            {codigo} · {curso}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {pendientes.isPending ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : pendientes.data?.length === 0 ? (
          <p className="py-2 text-sm text-muted-foreground">
            No hay matrículas pendientes para esta cátedra.
          </p>
        ) : (
          <Form
            form={form}
            onSubmit={onSubmit}
            id={`aprobar-matricula-${catedraId}`}
            className="flex flex-col gap-4"
          >
            <SelectField
              name="inscripcionId"
              label="Estudiante"
              placeholder="Seleccione un estudiante"
              options={(pendientes.data ?? []).map((item) => ({
                value: item.id,
                label: item.estudiante,
              }))}
            />
            <div className="grid grid-cols-2 gap-3">
              <NumberField
                name="montoMensual"
                label="Monto mensual"
                placeholder="0.00"
                integerOnly={false}
                asNumber
                startIcon={<Icon icon="ph:currency-dollar" className="size-4" aria-hidden="true" />}
              />
              <NumberField
                name="diaCobro"
                label="Día de cobro"
                placeholder="1–28"
                asNumber
              />
            </div>
            <TextField name="motivoAjuste" label="Motivo de ajuste (opcional)" />
          </Form>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button
            form={`aprobar-matricula-${catedraId}`}
            type="submit"
            disabled={mutation.isPending || pendientes.isPending || (pendientes.data?.length ?? 0) === 0}
          >
            {mutation.isPending ? (
              <Spinner className="size-4" />
            ) : (
              <Icon icon="ph:check" aria-hidden="true" />
            )}
            Aprobar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}