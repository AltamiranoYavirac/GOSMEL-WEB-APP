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
import { DateField, Form, SelectField, TextField, TimeField, useAppForm } from "@/shared/form";

import { useCrearSesion } from "../hooks/useCrearSesion";
import { useCatedrasParaHorarios } from "../hooks/useCatedrasParaHorarios";
import {
  ESTADO_SESION_OPCIONES,
  getSesionFormDefaults,
  sesionFormSchema,
  type ISesionFormValues,
} from "../model/SesionForm.config";
import type { ICrearSesionDialogProps } from "./CrearSesionDialog.types";

export default function CrearSesionDialog({ onSuccess }: ICrearSesionDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useCrearSesion();
  const catedras = useCatedrasParaHorarios(open);

  const form = useAppForm<ISesionFormValues>({
    schema: sesionFormSchema,
    defaultValues: getSesionFormDefaults(),
  });

  const onSubmit = (values: ISesionFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        form.reset(getSesionFormDefaults());
        setOpen(false);
        onSuccess?.();
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="sm">
          <Icon icon="ph:calendar-plus" aria-hidden="true" />
          Nueva sesión
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <AlertDialogHeader>
          <AlertDialogTitle>Programar sesión</AlertDialogTitle>
          <AlertDialogDescription>Agenda una sesión de clase para una cátedra activa.</AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id="crear-sesion" className="flex flex-col gap-4">
          <SelectField
            name="catedraId"
            label="Cátedra"
            placeholder="Seleccionar cátedra"
            options={(catedras.data ?? []).map((c) => ({ value: c.id, label: c.label }))}
          />
          <DateField name="fecha" label="Fecha" />
          <div className="grid grid-cols-2 gap-3">
            <TimeField name="horaInicio" label="Hora de inicio" />
            <TimeField name="horaFin" label="Hora de fin" />
          </div>
          <TextField name="tema" label="Tema de la sesión (opcional)" placeholder="Ej. Repertorio barroco y escalas" />
          <SelectField name="estado" label="Estado inicial" options={ESTADO_SESION_OPCIONES} />
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button form="crear-sesion" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            Guardar sesión
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
