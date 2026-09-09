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
import { Form, TextField, useAppForm } from "@/shared/form";

import { useCreateRepresentante } from "../hooks/useCreateRepresentante";
import {
  buildCrearRepresentantePayload,
  crearRepresentanteFormSchema,
  getCrearRepresentanteFormDefaults,
  type ICrearRepresentanteFormValues,
} from "../model/CrearRepresentanteForm.config";
import type { ICrearRepresentanteDialogProps } from "./CrearRepresentanteDialog.types";

export default function CrearRepresentanteDialog({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  onSuccess,
}: Partial<ICrearRepresentanteDialogProps> = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen ?? setInternalOpen;

  const createMutation = useCreateRepresentante();

  const form = useAppForm<ICrearRepresentanteFormValues>({
    schema: crearRepresentanteFormSchema,
    values: getCrearRepresentanteFormDefaults(),
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      form.reset(getCrearRepresentanteFormDefaults());
    }
  };

  const onSubmit = (values: ICrearRepresentanteFormValues) => {
    createMutation.mutate(buildCrearRepresentantePayload(values), {
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
            Nuevo Representante
          </Button>
        </AlertDialogTrigger>
      )}

      <AlertDialogContent className="w-full max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 text-primary">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Icon icon="ph:identification-badge" width={24} height={24} />
            </div>
            <div>
              <AlertDialogTitle className="text-xl font-bold">Registrar Representante</AlertDialogTitle>
              <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Ficha del tutor o familiar para asociar a estudiantes menores y coordinar cobranzas.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id="crear-representante" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1">
            <TextField name="nombres" label="Nombres" required placeholder="Ej. María Elena" />
            <TextField name="apellidos" label="Apellidos" required placeholder="Ej. Ramírez Castro" />
            <TextField name="celular" label="Teléfono celular" required placeholder="Ej. 0991234567" />
            <TextField name="cedula" label="Cédula / DNI" placeholder="Ej. 1712345678" />
            <div className="sm:col-span-2">
              <TextField name="email" label="Correo electrónico" type="email" placeholder="Ej. maria@correo.com" />
            </div>
            <TextField name="ocupacion" label="Ocupación / profesión" placeholder="Ej. Docente, Ingeniera..." />
            <TextField name="direccion" label="Dirección domiciliaria" placeholder="Ej. Sector Norte, Av. 10 de Agosto" />
          </div>
        </Form>

        <AlertDialogFooter className="pt-2 gap-3">
          <AlertDialogCancel type="button" disabled={createMutation.isPending} className="h-10 px-5">
            Cancelar
          </AlertDialogCancel>
          <Button
            form="crear-representante"
            type="submit"
            disabled={createMutation.isPending}
            className="h-10 px-6 font-semibold"
          >
            {createMutation.isPending && <Spinner className="size-4 mr-2" />}
            Guardar Representante
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
