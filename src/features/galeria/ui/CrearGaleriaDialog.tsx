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

import { useCrearGaleriaMedio } from "../hooks/useCrearGaleriaMedio";
import { useGaleriaOptions } from "../hooks/useGaleriaOptions";
import {
  CATEGORIA_GALERIA_OPCIONES,
  galeriaFormSchema,
  getGaleriaFormDefaults,
  type IGaleriaFormValues,
} from "../model/GaleriaForm.config";

export default function CrearGaleriaDialog() {
  const [open, setOpen] = useState(false);
  const options = useGaleriaOptions(open);
  const mutation = useCrearGaleriaMedio();
  const form = useAppForm<IGaleriaFormValues>({ schema: galeriaFormSchema, defaultValues: getGaleriaFormDefaults() });
  const archivo = form.watch("archivo");

  const onSubmit = (values: IGaleriaFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        form.reset(getGaleriaFormDefaults());
        setOpen(false);
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button>
          <Icon icon="ph:plus" aria-hidden="true" />
          Nuevo medio
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-h-[90vh] w-full max-w-2xl overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Agregar imagen a la galería</AlertDialogTitle>
          <AlertDialogDescription>La imagen se subirá a Cloudinary al guardar.</AlertDialogDescription>
        </AlertDialogHeader>
        <Form form={form} onSubmit={onSubmit} id="crear-medio-galeria" className="space-y-4">
          <ImageUploadField
            file={archivo}
            onFileChange={(file) => form.setValue("archivo", file, { shouldDirty: true })}
            onRemove={() => form.setValue("archivo", null, { shouldDirty: true })}
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
          <Button form="crear-medio-galeria" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            Guardar medio
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
