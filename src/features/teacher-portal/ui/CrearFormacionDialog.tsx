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
import {
  Form,
  NumberField,
  TextField,
  TextareaField,
  useAppForm,
} from "@/shared/form";

import { useCreateTeacherFormacion } from "../hooks/useCreateTeacherFormacion";
import {
  getTeacherFormacionFormDefaults,
  teacherFormacionFormSchema,
  type ITeacherFormacionFormValues,
} from "../model/TeacherFormacionForm.config";
import type { ICrearFormacionDialogProps } from "./CrearFormacionDialog.types";

export default function CrearFormacionDialog({
  open,
  onOpenChange,
}: ICrearFormacionDialogProps) {
  const createMutation = useCreateTeacherFormacion();

  const form = useAppForm<ITeacherFormacionFormValues>({
    schema: teacherFormacionFormSchema,
    defaultValues: getTeacherFormacionFormDefaults(),
  });

  useEffect(() => {
    if (open) {
      form.reset(getTeacherFormacionFormDefaults());
    }
  }, [open, form]);

  const handleSubmit = async (values: ITeacherFormacionFormValues) => {
    try {
      await createMutation.mutateAsync(values);
      toast.success("Formación académica registrada");
      onOpenChange(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al registrar formación";
      toast.error(msg);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Agregar Formación Académica</AlertDialogTitle>
          <AlertDialogDescription>
            Registra tus títulos universitarios, conservatorios o certificaciones musicales.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={handleSubmit} id="crear-formacion-form">
          <div className="space-y-3.5 py-2">
            <TextField
              name="titulo"
              label="Título o Especialidad"
              placeholder="Ej. Licenciatura en Música / Violín Clásico"
              required
            />
            <TextField
              name="institucion"
              label="Institución / Universidad"
              placeholder="Ej. Conservatorio Nacional de Música"
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <NumberField name="anioInicio" label="Año inicio" asNumber />
              <NumberField name="anioFin" label="Año graduación" asNumber />
            </div>
            <TextareaField
              name="descripcion"
              label="Detalles o logros (opcional)"
              placeholder="Mención de honor, cátedra cursada, etc."
            />
          </div>
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button
            type="submit"
            form="crear-formacion-form"
            disabled={createMutation.isPending}
          >
            Guardar Formación
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
