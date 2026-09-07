"use client";

import { Icon } from "@iconify/react";

import { Button, Spinner, AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/shared/ui";
import { Form, SelectField, TextareaField, useAppForm } from "@/shared/form";

import { useCreateCourseReview } from "../hooks/useCreateCourseReview";
import {
  crearResenaFormSchema,
  getCrearResenaFormDefaults,
  PUNTUACION_OPCIONES,
  type ICrearResenaFormValues,
} from "../model/CrearResenaForm.config";
import type { ICrearResenaDialogProps } from "./CrearResenaDialog.types";

export default function CrearResenaDialog({ estudianteId, catedras, open, onOpenChange }: ICrearResenaDialogProps) {
  const mutation = useCreateCourseReview(estudianteId);

  const form = useAppForm<ICrearResenaFormValues>({
    schema: crearResenaFormSchema,
    values: getCrearResenaFormDefaults(),
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });

  const handleOpenChange = (next: boolean) => {
    if (next) form.reset(getCrearResenaFormDefaults());
    onOpenChange(next);
  };

  const onSubmit = (values: ICrearResenaFormValues) => {
    mutation.mutate(values, { onSuccess: () => onOpenChange(false) });
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
          <AlertDialogTitle>Valorar mi curso</AlertDialogTitle>
          <AlertDialogDescription>Cuéntanos cómo fue tu experiencia. La reseña pasa por moderación.</AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id="crear-resena" className="flex flex-col gap-4">
          <SelectField name="cursoId" label="Curso" options={cursoOptions} placeholder="Selecciona el curso" />
          <SelectField name="puntuacion" label="Puntuación" options={PUNTUACION_OPCIONES} />
          <TextareaField name="comentario" label="Comentario (opcional)" rows={4} placeholder="Tu opinión sobre el curso y el docente" />
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button form="crear-resena" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            Enviar reseña
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}