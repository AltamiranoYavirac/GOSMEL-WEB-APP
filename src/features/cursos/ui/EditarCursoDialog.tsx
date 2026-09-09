"use client";

import { useEffect } from "react";
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
  ImageUploadField,
  Skeleton,
  Spinner,
} from "@/shared/ui";
import {
  Form,
  NumberField,
  SelectField,
  SwitchField,
  TextField,
  TextareaField,
  useAppForm,
} from "@/shared/form";

import { useUpdateCurso } from "../hooks/useUpdateCurso";
import { useCurso } from "../hooks/useCurso";
import {
  buildEditarCursoPayload,
  editarCursoFormSchema,
  mapCursoDetalleToFormValues,
  MODALIDAD_CURSO_OPCIONES,
  NIVEL_CURSO_OPCIONES,
  type IEditarCursoFormValues,
} from "../model/EditarCursoForm.config";
import type { IEditarCursoDialogProps } from "./EditarCursoDialog.types";

const EMPTY_DEFAULTS: IEditarCursoFormValues = {
  nombre: "",
  resumen: "",
  descripcion: "",
  nivel: "basico",
  modalidad: "presencial",
  duracionSemanas: null,
  horasTotales: null,
  precioReferencial: null,
  etiquetaPrecio: "",
  mostrarPrecio: false,
  videoIntroUrl: "",
  portadaPublicId: "",
  publicado: false,
  destacado: false,
};

export default function EditarCursoDialog({ curso, open, onOpenChange, onSuccess }: IEditarCursoDialogProps) {
  const { data: detalle, isLoading } = useCurso(open && curso ? curso.id : null);
  const updateMutation = useUpdateCurso();

  const form = useAppForm<IEditarCursoFormValues>({
    schema: editarCursoFormSchema,
    defaultValues: EMPTY_DEFAULTS,
  });

  useEffect(() => {
    if (detalle) {
      form.reset(mapCursoDetalleToFormValues(detalle));
    }
  }, [detalle, form]);

  if (!curso) return null;

  const onSubmit = (values: IEditarCursoFormValues) => {
    updateMutation.mutate(
      { id: curso.id, patch: buildEditarCursoPayload(values) },
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
      <AlertDialogContent className="w-full max-w-3xl sm:max-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 text-primary">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Icon icon="ph:book-open" width={24} height={24} />
            </div>
            <div>
              <AlertDialogTitle className="text-xl font-bold">Editar Curso: {curso.nombre}</AlertDialogTitle>
              <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Modifique la información académica, comercial y de presentación del curso.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        {isLoading ? (
          <div className="space-y-3 py-4">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <Form form={form} onSubmit={onSubmit} id={`editar-curso-${curso.id}`} className="flex flex-col gap-4">
            <ImageUploadField
              label="Foto de portada para la web pública"
              value={form.watch("portadaPublicId")}
              onChange={(val) => form.setValue("portadaPublicId", val, { shouldDirty: true })}
              folder="gosmel/cursos"
            />

            <TextField name="nombre" label="Nombre del curso" required />
            <TextField name="resumen" label="Resumen corto" placeholder="Frase breve para tarjetas y catálogo..." />
            <TextareaField name="descripcion" label="Descripción completa" required rows={4} />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <SelectField name="nivel" label="Nivel" options={NIVEL_CURSO_OPCIONES} />
              <SelectField name="modalidad" label="Modalidad" options={MODALIDAD_CURSO_OPCIONES} />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <NumberField name="duracionSemanas" label="Duración (semanas)" placeholder="—" asNumber />
              <NumberField name="horasTotales" label="Horas totales" placeholder="—" asNumber />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <NumberField
                name="precioReferencial"
                label="Precio referencial ($ USD)"
                placeholder="—"
                asNumber
                integerOnly={false}
              />
              <TextField name="etiquetaPrecio" label="Etiqueta de precio" placeholder="Ej. Desde $40 / mes" />
            </div>

            <TextField
              name="videoIntroUrl"
              label="URL video intro / muestra"
              placeholder="https://www.youtube.com/watch?v=..."
            />

            <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-border/40">
              <SwitchField name="publicado" label="Publicar en el catálogo web" />
              <SwitchField name="destacado" label="Curso destacado" />
              <SwitchField name="mostrarPrecio" label="Mostrar precio en catálogo" />
            </div>
          </Form>
        )}

        <AlertDialogFooter className="pt-2 gap-3">
          <AlertDialogCancel type="button" disabled={updateMutation.isPending} className="h-10 px-5">
            Cancelar
          </AlertDialogCancel>
          <Button
            form={`editar-curso-${curso.id}`}
            type="submit"
            disabled={updateMutation.isPending || isLoading}
            className="h-10 px-6 font-semibold"
          >
            {updateMutation.isPending && <Spinner className="size-4 mr-2" />}
            Guardar Cambios
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
