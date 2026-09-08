"use client";

import { useMemo, useState } from "react";
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
import { useRepresentantes } from "@/entities/representante";

import { useCreateEstudiante } from "../hooks/useCreateEstudiante";
import {
  buildCrearEstudiantePayload,
  crearEstudianteFormSchema,
  getCrearEstudianteFormDefaults,
  NIVEL_ESTUDIANTE_OPCIONES,
  PARENTESCO_OPCIONES,
  type ICrearEstudianteFormValues,
} from "../model/CrearEstudianteForm.config";
import type { ICrearEstudianteDialogProps } from "./CrearEstudianteDialog.types";

export default function CrearEstudianteDialog({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  defaultRepresentanteId,
  onSuccess,
}: ICrearEstudianteDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen ?? setInternalOpen;

  const { data: reps } = useRepresentantes();
  const createMutation = useCreateEstudiante();

  const form = useAppForm<ICrearEstudianteFormValues>({
    schema: crearEstudianteFormSchema,
    values: getCrearEstudianteFormDefaults(defaultRepresentanteId),
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });

  const esMenor = form.watch("esMenor");

  const representanteOpciones = useMemo(
    () =>
      (reps ?? []).map((r) => ({
        value: r.id,
        label: r.cedula ? `${r.nombre} (${r.cedula})` : r.nombre,
      })),
    [reps]
  );

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      form.reset(getCrearEstudianteFormDefaults(defaultRepresentanteId));
    }
  };

  const onSubmit = (values: ICrearEstudianteFormValues) => {
    createMutation.mutate(buildCrearEstudiantePayload(values), {
      onSuccess: (data) => {
        setOpen(false);
        if (data && onSuccess) {
          onSuccess(data.id);
        }
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      {controlledOpen === undefined && (
        <AlertDialogTrigger asChild>
          <Button className="gap-2">
            <Icon icon="ph:plus" width={16} height={16} aria-hidden="true" />
            Nuevo Estudiante
          </Button>
        </AlertDialogTrigger>
      )}

      <AlertDialogContent className="w-full max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 text-primary">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Icon icon="ph:student" width={24} height={24} />
            </div>
            <div>
              <AlertDialogTitle className="text-xl font-bold">Alta Presencial de Estudiante</AlertDialogTitle>
              <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Crea la ficha del alumno y vincula su tutor o representante legal.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id="crear-estudiante" className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextField name="nombres" label="Nombres" required placeholder="Ej. Mateo Sebastián" />
            <TextField name="apellidos" label="Apellidos" required placeholder="Ej. Ramírez Castro" />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DateField name="fechaNacimiento" label="Fecha de nacimiento" required />
            <SelectField name="nivel" label="Nivel musical" options={NIVEL_ESTUDIANTE_OPCIONES} />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextField
              name="cedula"
              label="Cédula / DNI"
              placeholder="Ej. 1750293847"
              startIcon={<Icon icon="ph:identification-card" className="size-4" aria-hidden="true" />}
            />
            <TextField
              name="celular"
              label="Celular de contacto"
              placeholder="Ej. 0998765432"
              startIcon={<Icon icon="ph:phone" className="size-4" aria-hidden="true" />}
            />
          </div>

          <TextField
            name="email"
            label="Correo (opcional)"
            placeholder="tu@correo.com"
            startIcon={<Icon icon="ph:envelope" className="size-4" aria-hidden="true" />}
          />

          <div className="pt-3 border-t border-border/40 space-y-4">
            <SwitchField name="esMenor" label="El estudiante es menor de edad (asociar representante)" />

            {esMenor && (
              <div className="grid grid-cols-1 gap-4 rounded-2xl border border-border/60 bg-background/50 p-4 sm:grid-cols-2">
                <SelectField
                  name="representanteId"
                  label="Representante registrado"
                  placeholder="Buscar representante..."
                  options={representanteOpciones}
                />
                <SelectField name="parentesco" label="Parentesco" options={PARENTESCO_OPCIONES} />
              </div>
            )}
          </div>
        </Form>

        <AlertDialogFooter className="pt-2 gap-3">
          <AlertDialogCancel type="button" disabled={createMutation.isPending} className="h-10 px-5">
            Cancelar
          </AlertDialogCancel>
          <Button
            form="crear-estudiante"
            type="submit"
            disabled={createMutation.isPending}
            className="h-10 px-6 font-semibold"
          >
            {createMutation.isPending && <Spinner className="size-4 mr-2" />}
            Guardar Estudiante
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
