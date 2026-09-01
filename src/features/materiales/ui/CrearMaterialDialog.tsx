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
import { Form, SelectField, TextField, useAppForm } from "@/shared/form";

import { useCrearMaterial } from "../hooks/useCrearMaterial";
import { useMaterialOptions } from "../hooks/useMaterialOptions";
import {
  crearMaterialFormSchema,
  DESTINO_OPCIONES,
  getCrearMaterialFormDefaults,
  TIPO_MATERIAL_OPCIONES,
  VISIBILIDAD_MATERIAL_OPCIONES,
  type ICrearMaterialFormValues,
} from "../model/CrearMaterialForm.config";

export default function CrearMaterialDialog() {
  const [open, setOpen] = useState(false);
  const options = useMaterialOptions(open);
  const mutation = useCrearMaterial();
  const form = useAppForm<ICrearMaterialFormValues>({
    schema: crearMaterialFormSchema,
    defaultValues: getCrearMaterialFormDefaults(),
  });
  const destino = form.watch("destino");

  const onSubmit = (values: ICrearMaterialFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        form.reset(getCrearMaterialFormDefaults());
        setOpen(false);
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button>
          <Icon icon="ph:plus" aria-hidden="true" />
          Nuevo material
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <AlertDialogHeader>
          <AlertDialogTitle>Crear material</AlertDialogTitle>
          <AlertDialogDescription>
            Comparte un enlace o recurso con estudiantes y docentes.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id="crear-material" className="flex flex-col gap-4">
          <TextField name="titulo" label="Título" placeholder="Ej. Partitura — Estudio 1" />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <SelectField name="tipo" label="Tipo" options={TIPO_MATERIAL_OPCIONES} />
            <SelectField name="visibilidad" label="Visibilidad" options={VISIBILIDAD_MATERIAL_OPCIONES} />
          </div>

          <TextField
            name="urlExterna"
            label="URL (opcional)"
            placeholder="https://…"
            startIcon={<Icon icon="ph:link" className="size-4" aria-hidden="true" />}
          />

          <SelectField name="destino" label="Asociar a (opcional)" placeholder="Sin asociar" options={DESTINO_OPCIONES} />

          {destino === "curso" ? (
            <SelectField
              name="cursoId"
              label="Curso"
              placeholder="Seleccione un curso"
              disabled={options.isPending}
              options={(options.data?.cursos ?? []).map((curso) => ({ value: curso.id, label: curso.nombre }))}
            />
          ) : null}

          {destino === "catedra" ? (
            <SelectField
              name="catedraId"
              label="Cátedra"
              placeholder="Seleccione una cátedra"
              disabled={options.isPending}
              options={(options.data?.catedras ?? []).map((catedra) => ({ value: catedra.id, label: catedra.label }))}
            />
          ) : null}
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button form="crear-material" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            Crear material
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}