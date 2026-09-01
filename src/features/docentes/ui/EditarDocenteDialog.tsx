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
import { Form, NumberField, SwitchField, TextareaField, TextField, useAppForm } from "@/shared/form";

import { useDocenteDetalle } from "../hooks/useDocenteDetalle";
import { useUpdateDocente } from "../hooks/useUpdateDocente";
import {
  editarDocenteFormSchema,
  getEditarDocenteFormDefaults,
  type IEditarDocenteFormValues,
} from "../model/EditarDocenteForm.config";
import type { IEditarDocenteDialogProps } from "./EditarDocenteDialog.types";

export default function EditarDocenteDialog({
  docente,
  open,
  onOpenChange,
  onSuccess,
}: IEditarDocenteDialogProps) {
  const { data: detalle } = useDocenteDetalle(docente?.id ?? "", Boolean(open && docente));
  const updateMutation = useUpdateDocente();

  const form = useAppForm<IEditarDocenteFormValues>({
    schema: editarDocenteFormSchema,
    values: getEditarDocenteFormDefaults({
      titulo: detalle?.titulo ?? "",
      aniosExperiencia: detalle?.aniosExperiencia ?? 0,
      biografia: detalle?.biografia ?? "",
      publicado: detalle?.publicado ?? false,
      destacado: detalle?.destacado ?? false,
    }),
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });

  if (!docente) return null;

  const onSubmit = (values: IEditarDocenteFormValues) => {
    updateMutation.mutate(
      {
        id: docente.id,
        patch: {
          titulo_profesional: values.titulo?.trim() || undefined,
          anios_experiencia: values.aniosExperiencia,
          biografia: values.biografia?.trim() || undefined,
          publicado: values.publicado,
          destacado: values.destacado,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          if (onSuccess) onSuccess();
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
              <AlertDialogTitle className="text-xl font-bold">Editar Perfil Docente</AlertDialogTitle>
              <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Actualice los datos profesionales y de difusión de {docente.nombre}.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id="editar-docente" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1">
            <TextField name="titulo" label="Título Profesional" placeholder="Ej. Lic. en Música" />
            <NumberField name="aniosExperiencia" label="Años de Experiencia" placeholder="0" asNumber />

            <div className="sm:col-span-2">
              <TextareaField name="biografia" label="Biografía" rows={4} />
            </div>

            <div className="sm:col-span-2 flex flex-wrap items-center gap-6 pt-3 border-t border-border/40">
              <SwitchField name="publicado" label="Publicado en facultad" />
              <SwitchField name="destacado" label="Docente destacado" />
            </div>
          </div>
        </Form>

        <AlertDialogFooter className="pt-2 gap-3">
          <AlertDialogCancel type="button" disabled={updateMutation.isPending} className="h-10 px-5">
            Cancelar
          </AlertDialogCancel>
          <Button form="editar-docente" type="submit" disabled={updateMutation.isPending} className="h-10 px-6 font-semibold">
            {updateMutation.isPending && <Spinner className="size-4 mr-2" />}
            Guardar Cambios
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}