"use client";

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
import { Form, TextField, useAppForm } from "@/shared/form";

import { useUpdateRepresentante } from "../hooks/useUpdateRepresentante";
import {
  editarRepresentanteFormSchema,
  getEditarRepresentanteFormDefaults,
  type IEditarRepresentanteFormValues,
} from "../model/EditarRepresentanteForm.config";
import type { IEditarRepresentanteDialogProps } from "./EditarRepresentanteDialog.types";

export default function EditarRepresentanteDialog({
  representante,
  open,
  onOpenChange,
}: IEditarRepresentanteDialogProps) {
  const updateMutation = useUpdateRepresentante();

  const form = useAppForm<IEditarRepresentanteFormValues>({
    schema: editarRepresentanteFormSchema,
    values: getEditarRepresentanteFormDefaults({
      nombres: representante?.nombres ?? "",
      apellidos: representante?.apellidos ?? "",
      celular: representante?.celular ?? "",
      cedula: representante?.cedula ?? "",
      email: representante?.email ?? "",
      ocupacion: representante?.ocupacion ?? "",
      direccion: representante?.direccion ?? "",
    }),
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });

  if (!representante) return null;

  const onSubmit = (values: IEditarRepresentanteFormValues) => {
    updateMutation.mutate(
      {
        id: representante.id,
        nombres: values.nombres,
        apellidos: values.apellidos,
        celular: values.celular,
        email: values.email?.trim() || undefined,
        cedula: values.cedula?.trim() || undefined,
        direccion: values.direccion?.trim() || undefined,
        ocupacion: values.ocupacion?.trim() || undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-full max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 text-primary">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Icon icon="ph:pencil-simple" width={24} height={24} />
            </div>
            <div>
              <AlertDialogTitle className="text-xl font-bold">Editar Representante</AlertDialogTitle>
              <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Actualice los datos de contacto y localización de {representante.nombre}.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id="editar-representante" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1">
            <TextField name="nombres" label="Nombres" />
            <TextField name="apellidos" label="Apellidos" />
            <TextField name="celular" label="Teléfono Celular" />
            <TextField name="cedula" label="Cédula / DNI" />
            <div className="sm:col-span-2">
              <TextField name="email" label="Correo Electrónico" type="email" />
            </div>
            <TextField name="ocupacion" label="Ocupación / Profesión" />
            <TextField name="direccion" label="Dirección" />
          </div>
        </Form>

        <AlertDialogFooter className="pt-2 gap-3">
          <AlertDialogCancel type="button" disabled={updateMutation.isPending} className="h-10 px-5">
            Cancelar
          </AlertDialogCancel>
          <Button form="editar-representante" type="submit" disabled={updateMutation.isPending} className="h-10 px-6 font-semibold">
            {updateMutation.isPending && <Spinner className="size-4 mr-2" />}
            Guardar Cambios
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}