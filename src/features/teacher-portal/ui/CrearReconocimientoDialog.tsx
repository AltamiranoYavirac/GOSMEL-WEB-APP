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

import { useCreateTeacherReconocimiento } from "../hooks/useCreateTeacherReconocimiento";
import {
  getTeacherReconocimientoFormDefaults,
  teacherReconocimientoFormSchema,
  type ITeacherReconocimientoFormValues,
} from "../model/TeacherReconocimientoForm.config";
import type { ICrearReconocimientoDialogProps } from "./CrearReconocimientoDialog.types";

export default function CrearReconocimientoDialog({
  open,
  onOpenChange,
}: ICrearReconocimientoDialogProps) {
  const createMutation = useCreateTeacherReconocimiento();

  const form = useAppForm<ITeacherReconocimientoFormValues>({
    schema: teacherReconocimientoFormSchema,
    defaultValues: getTeacherReconocimientoFormDefaults(),
  });

  useEffect(() => {
    if (open) {
      form.reset(getTeacherReconocimientoFormDefaults());
    }
  }, [open, form]);

  const handleSubmit = async (values: ITeacherReconocimientoFormValues) => {
    try {
      await createMutation.mutateAsync(values);
      toast.success("Reconocimiento registrado");
      onOpenChange(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al registrar reconocimiento";
      toast.error(msg);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Agregar Reconocimiento o Premio</AlertDialogTitle>
          <AlertDialogDescription>
            Registra distinciones, concursos ganados, menciones de honor o reconocimientos artísticos.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={handleSubmit} id="crear-reconocimiento-form">
          <div className="space-y-3.5 py-2">
            <TextField
              name="titulo"
              label="Nombre del Reconocimiento"
              placeholder="Ej. Primer Lugar Festival Internacional de Piano"
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <TextField
                name="entidadOtorgante"
                label="Entidad Otorgante"
                placeholder="Ej. Ministerio de Cultura"
              />
              <NumberField name="anio" label="Año" asNumber />
            </div>
            <TextareaField
              name="descripcion"
              label="Descripción (opcional)"
              placeholder="Detalles sobre el evento o la distinción..."
            />
          </div>
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button
            type="submit"
            form="crear-reconocimiento-form"
            disabled={createMutation.isPending}
          >
            Guardar Reconocimiento
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
