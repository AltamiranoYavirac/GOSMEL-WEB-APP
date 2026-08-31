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
import { DateField, Form, NumberField, SelectField, TextField, TimeField, useAppForm } from "@/shared/form";

import { useCatedraOptions } from "../hooks/useCatedraOptions";
import { useCrearCatedra } from "../hooks/useCrearCatedra";
import {
  crearCatedraFormSchema,
  DIA_SEMANA_OPCIONES,
  ESTADO_CATEDRA_OPCIONES,
  getCrearCatedraFormDefaults,
  MODALIDAD_OPCIONES,
  type ICrearCatedraFormValues,
} from "../model/CrearCatedraForm.config";

export default function CrearCatedraDialog() {
  const [open, setOpen] = useState(false);
  const options = useCatedraOptions(open);
  const mutation = useCrearCatedra();
  const form = useAppForm<ICrearCatedraFormValues>({
    schema: crearCatedraFormSchema,
    defaultValues: getCrearCatedraFormDefaults(),
  });

  const onSubmit = (values: ICrearCatedraFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        form.reset(getCrearCatedraFormDefaults());
        setOpen(false);
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button>
          <Icon icon="ph:plus" aria-hidden="true" />
          Nueva cátedra
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Crear cátedra</AlertDialogTitle>
          <AlertDialogDescription>
            Registra una nueva sección de curso con su docente, modalidad y horario.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id="crear-catedra" className="flex flex-col gap-4">
          <TextField name="codigo" label="Código" placeholder="Ej. CAT-2026-01" />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <SelectField
              name="cursoId"
              label="Curso"
              placeholder="Seleccione un curso"
              disabled={options.isPending}
              options={(options.data?.cursos ?? []).map((curso) => ({ value: curso.id, label: curso.nombre }))}
            />
            <SelectField
              name="docenteId"
              label="Docente"
              placeholder="Seleccione un docente"
              disabled={options.isPending}
              options={(options.data?.docentes ?? []).map((docente) => ({ value: docente.id, label: docente.nombre }))}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <SelectField name="modalidad" label="Modalidad" options={MODALIDAD_OPCIONES} />
            <SelectField name="estado" label="Estado" options={ESTADO_CATEDRA_OPCIONES} />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextField name="aula" label="Aula (opcional)" placeholder="Ej. Sala 1" />
            <NumberField name="cupoMaximo" label="Cupo máximo" placeholder="10" asNumber />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DateField name="fechaInicio" label="Inicio (opcional)" />
            <DateField name="fechaFin" label="Fin (opcional)" />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Horario</span>
            <span className="h-px flex-1 bg-border" aria-hidden="true" />
            <span className="text-xs text-muted-foreground">Opcional</span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <SelectField name="diaSemana" label="Día" placeholder="—" options={DIA_SEMANA_OPCIONES} />
            <TimeField name="horaInicio" label="Inicio" />
            <TimeField name="horaFin" label="Fin" />
          </div>
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button
            form="crear-catedra"
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            Crear cátedra
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}