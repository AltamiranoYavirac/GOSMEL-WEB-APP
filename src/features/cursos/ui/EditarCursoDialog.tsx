"use client";

import { useEffect } from "react";
import { Icon } from "@iconify/react";

import { Form, NumberField, SelectField, SwitchField, TextareaField, TextField, useAppForm } from "@/shared/form";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  ImageUploadField,
  Skeleton,
  Spinner,
} from "@/shared/ui";

import { useCurso } from "../hooks/useCurso";
import { useCursoOptions } from "../hooks/useCursoOptions";
import { useUpdateCurso } from "../hooks/useUpdateCurso";
import {
  CATEGORIA_EDITAR_CURSO_OPCIONES,
  editarCursoFormSchema,
  getEditarCursoFormDefaults,
  mapCursoDetalleToFormValues,
  MODALIDAD_CURSO_OPCIONES,
  NIVEL_CURSO_OPCIONES,
  type IEditarCursoFormValues,
} from "../model/EditarCursoForm.config";
import type { IEditarCursoDialogProps } from "./EditarCursoDialog.types";

export default function EditarCursoDialog({ curso, open, onOpenChange, onSuccess }: IEditarCursoDialogProps) {
  const { data: detalle, isLoading } = useCurso(open && curso ? curso.id : null);
  const options = useCursoOptions(open);
  const updateMutation = useUpdateCurso();
  const form = useAppForm<IEditarCursoFormValues>({
    schema: editarCursoFormSchema,
    defaultValues: getEditarCursoFormDefaults(),
  });
  const portadaArchivo = form.watch("portadaArchivo");
  const portadaPublicId = form.watch("portadaPublicId");
  const categoria = form.watch("categoria");
  const duracionPermanente = form.watch("duracionPermanente");

  useEffect(() => {
    if (detalle) form.reset(mapCursoDetalleToFormValues(detalle));
  }, [detalle, form]);

  useEffect(() => {
    if (categoria !== "instrumento") {
      form.setValue("instrumentoId", "", { shouldDirty: true });
    }
  }, [categoria, form]);

  useEffect(() => {
    if (duracionPermanente) {
      form.setValue("duracionSemanas", null, { shouldDirty: true });
      form.setValue("horasTotales", null, { shouldDirty: true });
    }
  }, [duracionPermanente, form]);

  if (!curso) return null;

  const onSubmit = (values: IEditarCursoFormValues) => {
    updateMutation.mutate(
      { id: curso.id, values, currentPublicId: detalle?.portadaPublicId || null },
      {
        onSuccess: () => {
          onOpenChange(false);
          onSuccess?.();
        },
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6 sm:max-w-4xl sm:p-8">
        <AlertDialogHeader>
          <AlertDialogTitle>Editar curso: {curso.nombre}</AlertDialogTitle>
          <AlertDialogDescription>Actualiza su contenido académico, comercial y público.</AlertDialogDescription>
        </AlertDialogHeader>

        {isLoading ? (
          <div className="space-y-3 py-4">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <Form form={form} onSubmit={onSubmit} id={`editar-curso-${curso.id}`} className="flex flex-col gap-5">
            <ImageUploadField
              label="Portada pública"
              value={portadaPublicId}
              file={portadaArchivo}
              onFileChange={(file) => {
                form.setValue("portadaArchivo", file, { shouldDirty: true });
                if (file) form.setValue("quitarPortada", false, { shouldDirty: true });
              }}
              onRemove={() => {
                form.setValue("portadaPublicId", "", { shouldDirty: true });
                form.setValue("quitarPortada", true, { shouldDirty: true });
              }}
              disabled={updateMutation.isPending}
            />
            <TextField name="portadaTextoAlt" label="Texto alternativo de portada" />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <TextField name="nombre" label="Nombre del curso" required />
              <SelectField name="categoria" label="Categoría" options={CATEGORIA_EDITAR_CURSO_OPCIONES} required />
            </div>
            <TextField name="resumen" label="Resumen para catálogo" />
            <TextareaField name="descripcion" label="Descripción completa" required rows={4} />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <SelectField name="nivel" label="Nivel" options={NIVEL_CURSO_OPCIONES} />
              <SelectField name="modalidad" label="Modalidad" options={MODALIDAD_CURSO_OPCIONES} />
              <SelectField
                name="instrumentoId"
                label="Instrumento"
                placeholder="Seleccione instrumento"
                required={categoria === "instrumento"}
                disabled={options.isPending || categoria !== "instrumento"}
                options={(options.data?.instrumentos ?? []).map((instrumento) => ({
                  value: instrumento.id,
                  label: instrumento.nombre,
                }))}
              />
              <NumberField name="orden" label="Orden" asNumber />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="space-y-2">
                <NumberField
                  name="duracionSemanas"
                  label="Duración en semanas"
                  asNumber
                  disabled={duracionPermanente}
                />
                <SwitchField name="duracionPermanente" label="Curso permanente" />
              </div>
              <NumberField name="horasTotales" label="Horas totales" asNumber disabled={duracionPermanente} />
              <NumberField name="precioReferencial" label="Precio referencial" asNumber integerOnly={false} />
            </div>
            <TextField name="etiquetaPrecio" label="Etiqueta de precio" placeholder="Ej. Desde $40 / mes" />

            <div className="flex items-center gap-3 pt-1">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Detalle público</span>
              <span className="h-px flex-1 bg-border" aria-hidden="true" />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <TextField name="publicoEdad" label="Público por edad" />
              <TextField name="publicoNivel" label="Público por nivel" />
              <TextField name="formatoClase" label="Formato de clase" />
              <TextField name="horarioResumen" label="Resumen de horarios" />
            </div>
            <TextField name="cierreEtapa" label="Cierre de etapa" />
            <TextareaField name="ctaTitulo" label="Título de la sección de inscripción" placeholder="Ej. ¿Listo para empezar?" rows={2} />
            <TextareaField name="ctaDescripcion" label="Descripción de la sección de inscripción" placeholder="Ej. Reserva una clase de prueba sin compromiso" rows={3} />
            <TextareaField name="ctaPrimarioTexto" label="Texto del botón de inscripción" placeholder="Ej. Reservar clase de prueba" rows={2} />
            <TextareaField name="ctaSecundarioTexto" label="Texto del botón secundario" placeholder="Ej. Ver otros cursos" rows={2} />

            <div className="flex flex-wrap items-center gap-6 border-t border-border/40 pt-3">
              <SwitchField name="publicado" label="Publicar en catálogo" />
              <SwitchField name="mostrarPrecio" label="Mostrar precio" />
            </div>
          </Form>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel type="button" disabled={updateMutation.isPending}>Cancelar</AlertDialogCancel>
          <Button form={`editar-curso-${curso.id}`} type="submit" disabled={updateMutation.isPending || isLoading}>
            {updateMutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            Guardar cambios
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
