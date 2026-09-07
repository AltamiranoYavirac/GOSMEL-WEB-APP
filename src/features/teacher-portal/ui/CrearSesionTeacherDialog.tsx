"use client";

import { useEffect } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
} from "@/shared/ui";
import { DateField, Form, SelectField, TextField, TimeField, useAppForm } from "@/shared/form";

import { useCreateTeacherSesion } from "../hooks/useCreateTeacherSesion";
import { useTeacherCatalogos } from "../hooks/useTeacherCatalogos";
import {
  getTeacherSesionFormDefaults,
  teacherSesionFormSchema,
  type ITeacherSesionFormValues,
} from "../model/TeacherSesionForm.config";
import type { ICrearSesionTeacherDialogProps } from "./CrearSesionTeacherDialog.types";

export default function CrearSesionTeacherDialog({
  open,
  onOpenChange,
  defaultCatedraId = "",
}: ICrearSesionTeacherDialogProps) {
  const { data: catalogos } = useTeacherCatalogos(open);
  const createMutation = useCreateTeacherSesion();

  const form = useAppForm<ITeacherSesionFormValues>({
    schema: teacherSesionFormSchema,
    defaultValues: getTeacherSesionFormDefaults(defaultCatedraId),
  });

  useEffect(() => {
    if (open) {
      form.reset(getTeacherSesionFormDefaults(defaultCatedraId));
    }
  }, [open, defaultCatedraId, form]);

  const catedraOptions = (catalogos?.catedras ?? []).map((c) => ({
    value: c.id,
    label: `${c.codigo} · ${c.cursoNombre}`,
  }));

  const handleSubmit = async (values: ITeacherSesionFormValues) => {
    try {
      await createMutation.mutateAsync(values);
      toast.success("Sesión creada exitosamente");
      onOpenChange(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al crear la sesión";
      toast.error(msg);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Programar Nueva Sesión</AlertDialogTitle>
          <AlertDialogDescription>
            Registra una sesión de clase manual para una de tus cátedras.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={handleSubmit} id="crear-sesion-form">
          <div className="space-y-4 py-2">
            <SelectField
              name="catedraId"
              label="Cátedra"
              placeholder="Selecciona una cátedra"
              options={catedraOptions}
              required
            />
            <DateField name="fecha" label="Fecha de la clase" required />
            <div className="grid grid-cols-2 gap-3">
              <TimeField name="horaInicio" label="Hora inicio" required />
              <TimeField name="horaFin" label="Hora fin" required />
            </div>
            <TextField
              name="tema"
              label="Tema / Lección (opcional)"
              placeholder="Ej. Escalas menores y arpegios"
            />
          </div>
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button
            type="submit"
            form="crear-sesion-form"
            disabled={createMutation.isPending}
          >
            Guardar Sesión
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
