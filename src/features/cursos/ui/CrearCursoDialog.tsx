"use client";

import { useEffect, useState } from "react";
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
  AlertDialogTrigger,
  Button,
  ImageUploadField,
  Spinner,
} from "@/shared/ui";

import { useCrearCurso } from "../hooks/useCrearCurso";
import { useCursoOptions } from "../hooks/useCursoOptions";
import {
  CATEGORIA_CURSO_OPCIONES,
  crearCursoFormSchema,
  getCrearCursoFormDefaults,
  MODALIDAD_OPCIONES,
  NIVEL_OPCIONES,
  type ICrearCursoFormValues,
} from "../model/CrearCursoForm.config";

export default function CrearCursoDialog() {
  const [open, setOpen] = useState(false);
  const options = useCursoOptions(open);
  const mutation = useCrearCurso();
  const form = useAppForm<ICrearCursoFormValues>({
    schema: crearCursoFormSchema,
    defaultValues: getCrearCursoFormDefaults(),
  });
  const portadaArchivo = form.watch("portadaArchivo");
  const categoria = form.watch("categoria");
  const duracionPermanente = form.watch("duracionPermanente");
  const nextOrden = options.data?.nextOrden ?? 1;

  useEffect(() => {
    if (!open || form.getFieldState("orden").isDirty) return;
    form.setValue("orden", nextOrden);
  }, [form, nextOrden, open]);

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

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      form.reset(getCrearCursoFormDefaults({ orden: nextOrden }));
    }
    setOpen(nextOpen);
  };

  const onSubmit = (values: ICrearCursoFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        form.reset(getCrearCursoFormDefaults({ orden: nextOrden }));
        setOpen(false);
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button>
          <Icon icon="ph:plus" aria-hidden="true" />
          Nuevo curso
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6 sm:max-w-4xl sm:p-8">
        <AlertDialogHeader>
          <AlertDialogTitle>Crear curso</AlertDialogTitle>
          <AlertDialogDescription>
            Registra el contenido académico y público del curso.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id="crear-curso" className="flex flex-col gap-5">
          <ImageUploadField
            label="Portada pública"
            file={portadaArchivo}
            onFileChange={(file) => form.setValue("portadaArchivo", file, { shouldDirty: true })}
            onRemove={() => form.setValue("portadaArchivo", null, { shouldDirty: true })}
            disabled={mutation.isPending}
          />
          <TextField name="portadaTextoAlt" label="Texto alternativo de portada" placeholder="Describe lo que aparece en la imagen" />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextField name="nombre" label="Nombre" placeholder="Ej. Guitarra eléctrica I" required />
            <SelectField name="categoria" label="Categoría" options={CATEGORIA_CURSO_OPCIONES} required />
          </div>
          <TextareaField name="descripcion" label="Descripción" rows={3} placeholder="Qué aprenderá el estudiante…" required />
          <TextField name="resumen" label="Resumen para catálogo" />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SelectField name="nivel" label="Nivel" options={NIVEL_OPCIONES} />
            <SelectField name="modalidad" label="Modalidad" options={MODALIDAD_OPCIONES} />
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
            <NumberField name="orden" label="Orden" hint="Se sugiere la siguiente posición." asNumber />
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
            <TextField name="publicoEdad" label="Público por edad" placeholder="Todas las edades" />
            <TextField name="publicoNivel" label="Público por nivel" placeholder="De principiante a avanzado" />
            <TextField name="formatoClase" label="Formato de clase" placeholder="Clases individuales" />
            <TextField name="horarioResumen" label="Resumen de horarios" placeholder="Flexible, lunes a sábado" />
          </div>
          <TextField name="cierreEtapa" label="Cierre de etapa" placeholder="Presentación en público" />

          <TextareaField name="ctaTitulo" label="Título de la sección de inscripción" placeholder="Ej. ¿Listo para empezar?" rows={2} />
          <TextareaField name="ctaDescripcion" label="Descripción de la sección de inscripción" placeholder="Ej. Reserva una clase de prueba sin compromiso" rows={3} />
          <TextareaField name="ctaPrimarioTexto" label="Texto del botón de inscripción" placeholder="Ej. Reservar clase de prueba" rows={2} />
          <TextareaField name="ctaSecundarioTexto" label="Texto del botón secundario" placeholder="Ej. Ver otros cursos" rows={2} />

          <div className="flex flex-wrap items-center gap-5">
            <SwitchField name="publicado" label="Publicado" />
            <SwitchField name="mostrarPrecio" label="Mostrar precio" />
          </div>
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>Cancelar</AlertDialogCancel>
          <Button form="crear-curso" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            Crear curso
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
