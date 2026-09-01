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
import { Form, SelectField, TimeField, useAppForm } from "@/shared/form";

import { useCrearHorarioRecurrente } from "../hooks/useCrearHorarioRecurrente";
import { useCatedrasParaHorarios } from "../hooks/useCatedrasParaHorarios";
import {
  DIAS_OPCIONES,
  getHorarioFormDefaults,
  horarioFormSchema,
  type IHorarioFormValues,
} from "../model/HorarioForm.config";
import type { ICrearHorarioDialogProps } from "./CrearHorarioDialog.types";

export default function CrearHorarioDialog({ onSuccess }: ICrearHorarioDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useCrearHorarioRecurrente();
  const catedras = useCatedrasParaHorarios(open);

  const form = useAppForm<IHorarioFormValues>({
    schema: horarioFormSchema,
    defaultValues: getHorarioFormDefaults(),
  });

  const onSubmit = (values: IHorarioFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        form.reset(getHorarioFormDefaults());
        setOpen(false);
        onSuccess?.();
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="sm">
          <Icon icon="ph:plus" aria-hidden="true" />
          Nuevo horario
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <AlertDialogHeader>
          <AlertDialogTitle>Nuevo horario semanal</AlertDialogTitle>
          <AlertDialogDescription>Configura la franja de clase recurrente de una cátedra.</AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id="crear-horario" className="flex flex-col gap-4">
          <SelectField
            name="catedraId"
            label="Cátedra"
            placeholder="Seleccionar cátedra"
            options={(catedras.data ?? []).map((c) => ({ value: c.id, label: c.label }))}
          />
          <SelectField
            name="diaSemana"
            label="Día de la semana"
            options={DIAS_OPCIONES}
          />
          <div className="grid grid-cols-2 gap-3">
            <TimeField name="horaInicio" label="Hora de inicio" />
            <TimeField name="horaFin" label="Hora de fin" />
          </div>
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button form="crear-horario" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            Guardar horario
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
