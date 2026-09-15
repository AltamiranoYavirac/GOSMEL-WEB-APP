"use client";

import { Icon } from "@iconify/react";

import { Button, Spinner, AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/shared/ui";
import { Form, SelectField, TextareaField, useAppForm } from "@/shared/form";

import { useCreateCourseReview } from "../hooks/useCreateCourseReview";
import { useEditarResenaPropia } from "../hooks/useEditarResenaPropia";
import {
  crearResenaFormSchema,
  getCrearResenaFormDefaults,
  PUNTUACION_OPCIONES,
  type ICrearResenaFormValues,
} from "../model/CrearResenaForm.config";
import type { ICrearResenaDialogProps } from "./CrearResenaDialog.types";

export default function CrearResenaDialog({ estudianteId, catedras, resena, open, onOpenChange }: ICrearResenaDialogProps) {
  const createMutation = useCreateCourseReview(estudianteId);
  const editMutation = useEditarResenaPropia(estudianteId);
  const pending = createMutation.isPending || editMutation.isPending;
  const isEditing = Boolean(resena);

  const form = useAppForm<ICrearResenaFormValues>({
    schema: crearResenaFormSchema,
    values: getCrearResenaFormDefaults(resena),
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });

  const handleOpenChange = (next: boolean) => {
    if (next) form.reset(getCrearResenaFormDefaults(resena));
    onOpenChange(next);
  };

  const onSubmit = (values: ICrearResenaFormValues) => {
    const onSuccess = () => onOpenChange(false);
    if (resena) editMutation.mutate({ resenaId: resena.id, values }, { onSuccess });
    else createMutation.mutate(values, { onSuccess });
  };

  const cursosUnicos = new Map<string, string>();
  for (const catedra of catedras) {
    if (catedra.cursoId && !cursosUnicos.has(catedra.cursoId)) {
      cursosUnicos.set(catedra.cursoId, catedra.curso);
    }
  }
  const cursoOptions = Array.from(cursosUnicos.entries()).map(([value, label]) => ({ value, label }));

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <AlertDialogHeader>
          <AlertDialogTitle>{isEditing ? "Editar reseña" : "Valorar mi curso"}</AlertDialogTitle>
          <AlertDialogDescription>
            {isEditing
              ? "Al guardar cambios, la reseña vuelve a moderación."
              : "Cuéntanos cómo fue tu experiencia. La reseña pasa por moderación."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id="crear-resena" className="flex flex-col gap-4">
          <SelectField
            name="cursoId"
            label="Curso"
            options={cursoOptions}
            placeholder="Selecciona el curso"
            disabled={isEditing}
          />
          <SelectField name="puntuacion" label="Puntuación" options={PUNTUACION_OPCIONES} />
          <TextareaField name="comentario" label="Comentario (opcional)" rows={4} placeholder="Tu opinión sobre el curso y el docente" />
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancelar</AlertDialogCancel>
          <Button form="crear-resena" type="submit" disabled={pending}>
            {pending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            {isEditing ? "Guardar cambios" : "Enviar reseña"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}