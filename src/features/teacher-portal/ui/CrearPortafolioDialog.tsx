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
import { Form, SelectField, TextField, useAppForm } from "@/shared/form";

import { useCreateTeacherPortafolio } from "../hooks/useCreateTeacherPortafolio";
import {
  getTeacherPortafolioFormDefaults,
  PORTAFOLIO_TIPO_OPCIONES,
  teacherPortafolioFormSchema,
  type ITeacherPortafolioFormValues,
} from "../model/TeacherPortafolioForm.config";
import type { ICrearPortafolioDialogProps } from "./CrearPortafolioDialog.types";

export default function CrearPortafolioDialog({
  open,
  onOpenChange,
}: ICrearPortafolioDialogProps) {
  const createMutation = useCreateTeacherPortafolio();

  const form = useAppForm<ITeacherPortafolioFormValues>({
    schema: teacherPortafolioFormSchema,
    defaultValues: getTeacherPortafolioFormDefaults(),
  });

  useEffect(() => {
    if (open) {
      form.reset(getTeacherPortafolioFormDefaults());
    }
  }, [open, form]);

  const handleSubmit = async (values: ITeacherPortafolioFormValues) => {
    try {
      await createMutation.mutateAsync(values);
      toast.success("Elemento de portafolio agregado");
      onOpenChange(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al agregar portafolio";
      toast.error(msg);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Agregar a mi Portafolio</AlertDialogTitle>
          <AlertDialogDescription>
            Comparte enlaces a videos, presentaciones, audios o material gráfico de tu trayectoria musical.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={handleSubmit} id="crear-portafolio-form">
          <div className="space-y-3.5 py-2">
            <TextField
              name="titulo"
              label="Título del trabajo"
              placeholder="Ej. Concierto en el Teatro Sucre"
              required
            />
            <SelectField
              name="tipo"
              label="Tipo de medio"
              options={PORTAFOLIO_TIPO_OPCIONES}
              required
            />
            <TextField
              name="urlExterna"
              label="URL externa (YouTube, SoundCloud, Spotify, Web)"
              placeholder="https://youtube.com/watch?v=..."
              required
            />
          </div>
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button
            type="submit"
            form="crear-portafolio-form"
            disabled={createMutation.isPending}
          >
            Guardar Elemento
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
