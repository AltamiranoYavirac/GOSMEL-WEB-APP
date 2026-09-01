"use client";

import { useEffect } from "react";
import { Icon } from "@iconify/react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Spinner,
} from "@/shared/ui";
import { DateField, Form, SelectField, useAppForm } from "@/shared/form";

import { useAsignarEstudiante } from "../hooks/useAsignarEstudiante";
import {
  asignarEstudianteFormSchema,
  getAsignarEstudianteFormDefaults,
  NIVEL_ESTUDIANTE_OPCIONES,
  type IAsignarEstudianteFormValues,
  type TNivelCurso,
} from "../model/AsignarEstudianteForm.config";

interface IAsignarEstudianteDialogProps {
  usuario: { id: string; nombre: string; cedula: string | null } | null;
  onClose: () => void;
}

export default function AsignarEstudianteDialog({ usuario, onClose }: IAsignarEstudianteDialogProps) {
  const open = !!usuario;
  const mutation = useAsignarEstudiante();
  const form = useAppForm<IAsignarEstudianteFormValues>({
    schema: asignarEstudianteFormSchema,
    defaultValues: getAsignarEstudianteFormDefaults(),
  });

  useEffect(() => {
    if (usuario) {
      form.reset(getAsignarEstudianteFormDefaults());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario]);

  const onSubmit = (values: IAsignarEstudianteFormValues) => {
    if (!usuario) return;
    mutation.mutate(
      {
        perfilId: usuario.id,
        nombre: usuario.nombre,
        values: {
          cedula: usuario.cedula,
          fechaNacimiento: values.fechaNacimiento,
          nivel: (values.nivel || null) as TNivelCurso | null,
        },
      },
      { onSuccess: onClose }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={(next) => (next ? undefined : onClose())}>
      <AlertDialogContent className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <AlertDialogHeader>
          <AlertDialogTitle>Asignar rol de estudiante</AlertDialogTitle>
          <AlertDialogDescription>
            {usuario ? usuario.nombre : ""} — crea su ficha como estudiante.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id="asignar-estudiante" className="flex flex-col gap-4">
          <DateField name="fechaNacimiento" label="Fecha de nacimiento" />
          <SelectField name="nivel" label="Nivel musical (opcional)" placeholder="Sin nivel" options={NIVEL_ESTUDIANTE_OPCIONES} />
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button form="asignar-estudiante" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            Asignar estudiante
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}