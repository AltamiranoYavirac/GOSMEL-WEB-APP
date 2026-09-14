"use client";

import { useMemo } from "react";
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
import {
  Form,
  MultiSelectField,
  NumberField,
  SelectField,
  SwitchField,
  TextareaField,
  TextField,
  useAppForm,
} from "@/shared/form";
import { useInstrumentoOptions } from "@/entities/instrument";

import { useDocenteDetalle } from "../hooks/useDocenteDetalle";
import { useUpdateDocente } from "../hooks/useUpdateDocente";
import {
  buildDocentePatch,
  buildInstrumentosPayload,
  editarDocenteFormSchema,
  mapDocenteToFormValues,
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
  const { data: instrumentos = [], isLoading: loadingInstrumentos } = useInstrumentoOptions(Boolean(open));
  const updateMutation = useUpdateDocente();

  const form = useAppForm<IEditarDocenteFormValues>({
    schema: editarDocenteFormSchema,
    values: mapDocenteToFormValues({
      slug: detalle?.slug ?? "",
      titulo: detalle?.titulo ?? null,
      aniosExperiencia: detalle?.aniosExperiencia ?? null,
      fraseDestacada: detalle?.fraseDestacada ?? null,
      biografia: detalle?.biografia ?? null,
      redesSociales: detalle?.redesSociales ?? {},
      instrumentoIds: detalle?.instrumentoIds ?? [],
      instrumentoPrincipalId: detalle?.instrumentoPrincipalId ?? null,
      publicado: detalle?.publicado ?? false,
      destacado: detalle?.destacado ?? false,
    }),
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });

  const instrumentoOpciones = useMemo(
    () => instrumentos.map((instrumento) => ({ value: instrumento.id, label: instrumento.nombre })),
    [instrumentos]
  );

  const instrumentoIds = form.watch("instrumentoIds");
  const instrumentoPrincipalOpciones = useMemo(
    () => instrumentoOpciones.filter((opcion) => instrumentoIds.includes(opcion.value)),
    [instrumentoOpciones, instrumentoIds]
  );

  if (!docente) return null;

  const onSubmit = (values: IEditarDocenteFormValues) => {
    updateMutation.mutate(
      {
        id: docente.id,
        patch: buildDocentePatch(values),
        instrumentos: buildInstrumentosPayload(values),
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
                Actualice los datos profesionales, instrumentos y redes de {docente.nombre}.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id="editar-docente" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            name="slug"
            label="Slug público (URL)"
            required
            placeholder="Ej. leo-brouwer"
            hint={`Se verá como /teachers/${(form.watch("slug") || "slug").toString()}`}
          />
          <TextField name="titulo" label="Título profesional" placeholder="Ej. Lic. en Música" />

          <div className="sm:col-span-2">
            <MultiSelectField
              name="instrumentoIds"
              label="Instrumentos que enseña"
              placeholder="Seleccione uno o varios instrumentos..."
              emptyLabel="No hay instrumentos registrados"
              options={instrumentoOpciones}
              disabled={loadingInstrumentos}
            />
          </div>

          <SelectField
            name="instrumentoPrincipalId"
            label="Instrumento principal"
            placeholder={
              instrumentoPrincipalOpciones.length > 0
                ? "Seleccione instrumento..."
                : "Selecciona primero los instrumentos"
            }
            disabled={instrumentoPrincipalOpciones.length === 0}
            options={instrumentoPrincipalOpciones}
          />
          <NumberField
            name="aniosExperiencia"
            label="Años de experiencia"
            placeholder="Sin especificar"
            asNumber
          />

          <div className="sm:col-span-2">
            <TextField
              name="fraseDestacada"
              label="Frase destacada"
              placeholder="Ej. 'La disciplina en el piano transforma el alma.'"
            />
          </div>

          <div className="sm:col-span-2">
            <TextareaField name="biografia" label="Biografía / trayectoria" rows={4} />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Redes sociales</span>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <TextField name="instagram" label="Instagram" placeholder="usuario o enlace" />
              <TextField name="facebook" label="Facebook" placeholder="usuario o enlace" />
              <TextField name="youtube" label="YouTube" placeholder="canal o enlace" />
              <TextField name="linkedin" label="LinkedIn" placeholder="usuario o enlace" />
            </div>
          </div>

          <div className="sm:col-span-2 flex flex-wrap items-center gap-6 pt-3 border-t border-border/40">
            <SwitchField name="publicado" label="Publicado en facultad" />
            <SwitchField name="destacado" label="Docente destacado" />
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
