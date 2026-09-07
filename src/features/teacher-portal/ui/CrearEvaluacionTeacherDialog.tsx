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
  DateField,
  Form,
  NumberField,
  SelectField,
  TextField,
  TextareaField,
  useAppForm,
} from "@/shared/form";

import { useCreateTeacherEvaluacion } from "../hooks/useCreateTeacherEvaluacion";
import { useTeacherCatalogos } from "../hooks/useTeacherCatalogos";
import {
  EVALUACION_TIPO_OPCIONES,
  getTeacherEvaluacionFormDefaults,
  teacherEvaluacionFormSchema,
  type ITeacherEvaluacionFormValues,
} from "../model/TeacherEvaluacionForm.config";
import type { ICrearEvaluacionTeacherDialogProps } from "./CrearEvaluacionTeacherDialog.types";

export default function CrearEvaluacionTeacherDialog({
  open,
  onOpenChange,
  defaultCatedraId = "",
}: ICrearEvaluacionTeacherDialogProps) {
  const { data: catalogos } = useTeacherCatalogos(open);
  const createMutation = useCreateTeacherEvaluacion();

  const form = useAppForm<ITeacherEvaluacionFormValues>({
    schema: teacherEvaluacionFormSchema,
    defaultValues: getTeacherEvaluacionFormDefaults(defaultCatedraId),
  });

  useEffect(() => {
    if (open) {
      form.reset(getTeacherEvaluacionFormDefaults(defaultCatedraId));
    }
  }, [open, defaultCatedraId, form]);

  const catedraOptions = (catalogos?.catedras ?? []).map((c) => ({
    value: c.id,
    label: `${c.codigo} · ${c.cursoNombre}`,
  }));

  const handleSubmit = async (values: ITeacherEvaluacionFormValues) => {
    try {
      await createMutation.mutateAsync(values);
      toast.success("Evaluación creada exitosamente");
      onOpenChange(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al crear evaluación";
      toast.error(msg);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Programar Nueva Evaluación</AlertDialogTitle>
          <AlertDialogDescription>
            Crea una evaluación académica para los estudiantes de una de tus cátedras.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={handleSubmit} id="crear-evaluacion-form">
          <div className="space-y-3.5 py-2">
            <SelectField
              name="catedraId"
              label="Cátedra"
              placeholder="Selecciona cátedra"
              options={catedraOptions}
              required
            />
            <TextField
              name="titulo"
              label="Título de la evaluación"
              placeholder="Ej. Recital de mitad de período"
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <SelectField
                name="tipo"
                label="Tipo"
                options={EVALUACION_TIPO_OPCIONES}
                required
              />
              <DateField name="fecha" label="Fecha" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <NumberField name="notaMaxima" label="Nota máxima" asNumber required />
              <NumberField name="ponderacion" label="Ponderación (%)" asNumber required />
            </div>
            <TextareaField
              name="descripcion"
              label="Indicaciones (opcional)"
              placeholder="Rúbrica o detalles para los alumnos..."
            />
          </div>
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button
            type="submit"
            form="crear-evaluacion-form"
            disabled={createMutation.isPending}
          >
            Guardar Evaluación
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
