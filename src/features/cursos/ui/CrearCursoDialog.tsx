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
import { Form, NumberField, SelectField, SwitchField, TextareaField, TextField, useAppForm } from "@/shared/form";

import { useCrearCurso } from "../hooks/useCrearCurso";
import { useCursoOptions } from "../hooks/useCursoOptions";
import {
  crearCursoFormSchema,
  getCrearCursoFormDefaults,
  MODALIDAD_OPCIONES,
  NIVEL_OPCIONES,
  type ICrearCursoFormValues,
} from "../model/CrearCursoForm.config";

export default function CrearCursoDialog() {
  const [open, setOpen] = useState(false);
  const options = useCursoOptions(open);
  const mutation = useCrearCurso();
  const form = useAppForm<ICrearCursoFormValues>({
    schema: crearCursoFormSchema,
    defaultValues: getCrearCursoFormDefaults(),
  });
  const asignarDocente = form.watch("asignarDocente");

  const onSubmit = (values: ICrearCursoFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        form.reset(getCrearCursoFormDefaults());
        setOpen(false);
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button>
          <Icon icon="ph:plus" aria-hidden="true" />
          Nuevo curso
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Crear curso</AlertDialogTitle>
          <AlertDialogDescription>
            Registra un nuevo curso y, si lo deseas, asígnalo a un docente creando su cátedra.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id="crear-curso" className="flex flex-col gap-4">
          <TextField name="nombre" label="Nombre" placeholder="Ej. Guitarra eléctrica I" />
          <TextareaField name="descripcion" label="Descripción" rows={3} placeholder="Qué aprenderá el estudiante…" />
          <TextField name="resumen" label="Resumen (opcional)" />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <SelectField name="nivel" label="Nivel" options={NIVEL_OPCIONES} />
            <SelectField name="modalidad" label="Modalidad" options={MODALIDAD_OPCIONES} />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <SelectField
              name="instrumentoId"
              label="Instrumento (opcional)"
              placeholder="Sin instrumento"
              disabled={options.isPending}
              options={(options.data?.instrumentos ?? []).map((instrumento) => ({
                value: instrumento.id,
                label: instrumento.nombre,
              }))}
            />
            <NumberField name="duracionSemanas" label="Duración (semanas, opcional)" placeholder="—" asNumber />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <NumberField name="horasTotales" label="Horas totales (opcional)" placeholder="—" asNumber />
            <div className="flex items-center gap-4 pt-1">
              <SwitchField name="publicado" label="Publicado" />
              <SwitchField name="destacado" label="Destacado" />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Asignación a docente</span>
            <span className="h-px flex-1 bg-border" aria-hidden="true" />
            <span className="text-xs text-muted-foreground">Opcional</span>
          </div>

          <SwitchField name="asignarDocente" label="Asignar este curso a un docente" />

          {asignarDocente ? (
            <div className="space-y-3">
              <SelectField
                name="docenteId"
                label="Docente"
                placeholder="Seleccione un docente"
                disabled={options.isPending}
                options={(options.data?.docentes ?? []).map((docente) => ({
                  value: docente.id,
                  label: docente.nombre,
                }))}
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <TextField name="aula" label="Aula (opcional)" placeholder="Ej. Sala 1" />
                <NumberField name="cupoMaximo" label="Cupo máximo" placeholder="10" asNumber />
              </div>
            </div>
          ) : null}
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button form="crear-curso" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            Crear curso
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}