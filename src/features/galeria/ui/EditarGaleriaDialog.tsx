"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

import { Form, NumberField, SelectField, SwitchField, TextField, useAppForm } from "@/shared/form";
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
  ImageUploadField,
  Spinner,
} from "@/shared/ui";

import { useGaleriaOptions } from "../hooks/useGaleriaOptions";
import { useUpdateGaleriaMedio } from "../hooks/useUpdateGaleriaMedio";
import {
  CATEGORIA_GALERIA_OPCIONES,
  galeriaFormSchema,
  mapGaleriaToFormValues,
  type IGaleriaFormValues,
} from "../model/GaleriaForm.config";
import type { IEditarGaleriaDialogProps } from "./EditarGaleriaDialog.types";

export default function EditarGaleriaDialog({ item }: IEditarGaleriaDialogProps) {
  const [open, setOpen] = useState(false);
  const options = useGaleriaOptions(open);
  const mutation = useUpdateGaleriaMedio();
  const form = useAppForm<IGaleriaFormValues>({
    schema: galeriaFormSchema,
    values: mapGaleriaToFormValues(item),
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });
  const archivo = form.watch("archivo");
  const publicId = form.watch("publicId");

  const onSubmit = (values: IGaleriaFormValues) => {
    mutation.mutate(
      { id: item.id, values, currentPublicId: item.publicId },
      { onSuccess: () => setOpen(false) }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon-xs" aria-label={`Editar ${item.titulo ?? "medio"}`}>
          <Icon icon="ph:pencil-simple" aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-h-[90vh] w-full max-w-2xl overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Editar medio</AlertDialogTitle>
          <AlertDialogDescription>Actualiza la imagen y sus datos públicos.</AlertDialogDescription>
        </AlertDialogHeader>
        <Form form={form} onSubmit={onSubmit} id={`editar-medio-${item.id}`} className="space-y-4">
          <ImageUploadField
            value={publicId}
            file={archivo}
            onFileChange={(file) => {
              form.setValue("archivo", file, { shouldDirty: true });
              if (file) form.setValue("quitarImagen", false, { shouldDirty: true });
            }}
            onRemove={() => {
              form.setValue("publicId", "", { shouldDirty: true });
              form.setValue("quitarImagen", true, { shouldDirty: true });
            }}
            disabled={mutation.isPending}
          />
          <TextField name="textoAlt" label="Texto alternativo" required />
          <TextField name="titulo" label="Título" />
          <div className="grid gap-3 sm:grid-cols-2">
            <SelectField name="categoria" label="Categoría" options={CATEGORIA_GALERIA_OPCIONES} />
            <SelectField
              name="cursoId"
              label="Curso asociado"
              placeholder="Galería general"
              disabled={options.isPending}
              options={(options.data ?? []).map((curso) => ({ value: curso.id, label: curso.nombre }))}
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-3">
            <NumberField name="orden" label="Orden" asNumber />
            <div className="pt-5"><SwitchField name="publicado" label="Publicado" /></div>
          </div>
        </Form>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>Cancelar</AlertDialogCancel>
          <Button form={`editar-medio-${item.id}`} type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            Guardar cambios
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
