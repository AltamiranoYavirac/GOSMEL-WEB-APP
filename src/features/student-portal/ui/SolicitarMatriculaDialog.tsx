"use client";

import { Icon } from "@iconify/react";

import { Button, Spinner, AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, Skeleton } from "@/shared/ui";
import { DateField, Form, SelectField, SwitchField, TextField, useAppForm } from "@/shared/form";

import { useCatedrasDisponibles } from "../hooks/useCatedrasDisponibles";
import { useSolicitarMatricula } from "../hooks/useSolicitarMatricula";
import {
  getSolicitarMatriculaFormDefaults,
  PARENTESCO_OPCIONES,
  solicitarMatriculaFormSchema,
  type ISolicitarMatriculaFormValues,
} from "../model/SolicitarMatriculaForm.config";
import type { ISolicitarMatriculaDialogProps } from "./SolicitarMatriculaDialog.types";

export default function SolicitarMatriculaDialog({ open, onOpenChange }: ISolicitarMatriculaDialogProps) {
  const mutation = useSolicitarMatricula();
  const { data: catedras, isPending } = useCatedrasDisponibles(open);

  const form = useAppForm<ISolicitarMatriculaFormValues>({
    schema: solicitarMatriculaFormSchema,
    values: getSolicitarMatriculaFormDefaults(),
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });

  const paraMenor = form.watch("paraMenor");

  const handleOpenChange = (next: boolean) => {
    if (next) form.reset(getSolicitarMatriculaFormDefaults());
    onOpenChange(next);
  };

  const onSubmit = (values: ISolicitarMatriculaFormValues) => {
    mutation.mutate(
      {
        catedraId: values.catedraId,
        paraMenor: values.paraMenor,
        nombres: values.nombres,
        apellidos: values.apellidos,
        fechaNacimiento: values.fechaNacimiento,
        parentesco: values.parentesco,
      },
      { onSuccess: () => onOpenChange(false) }
    );
  };

  const catedraOptions = (catedras ?? []).map((catedra) => ({
    value: catedra.id,
    label: `${catedra.codigo} — ${catedra.curso}`,
  }));

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <AlertDialogHeader>
          <AlertDialogTitle>Solicitar matrícula</AlertDialogTitle>
          <AlertDialogDescription>Postula a una cátedra adicional y el equipo de admisiones la revisará.</AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id="solicitar-matricula" className="flex flex-col gap-4">
          {isPending ? (
            <Skeleton className="h-10 rounded-lg" />
          ) : (
            <SelectField name="catedraId" label="Cátedra" options={catedraOptions} placeholder="Selecciona la cátedra" />
          )}
          <SwitchField name="paraMenor" label="La matrícula es para un menor de edad" />

          {paraMenor ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <TextField name="nombres" label="Nombre del estudiante" />
              <TextField name="apellidos" label="Apellido del estudiante" />
              <DateField name="fechaNacimiento" label="Fecha de nacimiento" />
              <SelectField name="parentesco" label="Parentesco" options={PARENTESCO_OPCIONES} />
            </div>
          ) : null}
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button form="solicitar-matricula" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            Enviar solicitud
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}