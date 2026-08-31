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
import { DateField, Form, SelectField, SwitchField, TextField, useAppForm } from "@/shared/form";

import { useUpdateEstudiante } from "../hooks/useUpdateEstudiante";
import {
  editarEstudianteFormSchema,
  getEditarEstudianteFormDefaults,
  NIVEL_ESTUDIANTE_OPCIONES,
  type IEditarEstudianteFormValues,
} from "../model/EditarEstudianteForm.config";
import type { IEstudianteRow } from "../model/estudiante.types";

interface IEditarEstudianteDialogProps {
  estudiante: IEstudianteRow;
}

export default function EditarEstudianteDialog({ estudiante }: IEditarEstudianteDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useUpdateEstudiante();
  const form = useAppForm<IEditarEstudianteFormValues>({
    schema: editarEstudianteFormSchema,
    values: getEditarEstudianteFormDefaults(estudiante),
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      form.reset(getEditarEstudianteFormDefaults(estudiante));
    }
  };

  const onSubmit = (values: IEditarEstudianteFormValues) => {
    mutation.mutate(
      { id: estudiante.id, values },
      {
        onSuccess: () => setOpen(false),
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Icon icon="ph:pencil-simple" aria-hidden="true" />
          Editar
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Editar estudiante</AlertDialogTitle>
          <AlertDialogDescription>{estudiante.nombreCompleto}</AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id={`editar-estudiante-${estudiante.id}`} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextField name="nombres" label="Nombres" />
            <TextField name="apellidos" label="Apellidos" />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextField
              name="cedula"
              label="Cédula"
              placeholder="Número de cédula"
              startIcon={<Icon icon="ph:identification-card" className="size-4" aria-hidden="true" />}
            />
            <TextField
              name="celular"
              label="Celular"
              placeholder="Número de celular"
              startIcon={<Icon icon="ph:phone" className="size-4" aria-hidden="true" />}
            />
          </div>

          <TextField
            name="email"
            label="Correo"
            placeholder="tu@correo.com"
            startIcon={<Icon icon="ph:envelope" className="size-4" aria-hidden="true" />}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DateField name="fechaNacimiento" label="Fecha de nacimiento" />
            <SelectField name="nivel" label="Nivel musical" placeholder="Sin nivel" options={NIVEL_ESTUDIANTE_OPCIONES} />
          </div>

          <SwitchField name="activo" label="Estudiante activo" />
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button form={`editar-estudiante-${estudiante.id}`} type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            Guardar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}