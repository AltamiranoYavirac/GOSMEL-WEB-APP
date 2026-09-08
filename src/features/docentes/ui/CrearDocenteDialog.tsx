"use client";

import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";

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
import { useInstrumentoOptions } from "@/entities/instrument";

import { useCreateDocente } from "../hooks/useCreateDocente";
import { usePerfilesDisponibles } from "../hooks/usePerfilesDisponibles";
import {
  buildCrearDocentePayload,
  crearDocenteFormSchema,
  getCrearDocenteFormDefaults,
  type ICrearDocenteFormValues,
} from "../model/CrearDocenteForm.config";
import type { ICrearDocenteDialogProps } from "./CrearDocenteDialog.types";

export default function CrearDocenteDialog({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  onSuccess,
}: ICrearDocenteDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen ?? setInternalOpen;

  const { data: perfiles = [], isLoading: loadingPerfiles } = usePerfilesDisponibles(open);
  const { data: instrumentos = [], isLoading: loadingInstrumentos } = useInstrumentoOptions(open);
  const loadingOptions = loadingPerfiles || loadingInstrumentos;

  const createMutation = useCreateDocente();

  const form = useAppForm<ICrearDocenteFormValues>({
    schema: crearDocenteFormSchema,
    values: getCrearDocenteFormDefaults(),
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });

  const perfilOpciones = useMemo(
    () =>
      perfiles.map((p) => ({
        value: p.id,
        label: p.email ? `${p.nombre} (${p.email})` : p.nombre,
      })),
    [perfiles]
  );

  const instrumentoOpciones = useMemo(
    () => instrumentos.map((i) => ({ value: i.id, label: i.nombre })),
    [instrumentos]
  );

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      form.reset(getCrearDocenteFormDefaults());
    }
  };

  const onSubmit = (values: ICrearDocenteFormValues) => {
    const perfilNombre = perfiles.find((p) => p.id === values.perfilId)?.nombre ?? "";
    createMutation.mutate(buildCrearDocentePayload(values, perfilNombre), {
      onSuccess: () => {
        setOpen(false);
        if (onSuccess) onSuccess();
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      {controlledOpen === undefined && (
        <AlertDialogTrigger asChild>
          <Button className="gap-2">
            <Icon icon="ph:plus" width={16} height={16} aria-hidden="true" />
            Nuevo Docente
          </Button>
        </AlertDialogTrigger>
      )}

      <AlertDialogContent className="w-full max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 text-primary">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Icon icon="ph:chalkboard-teacher" width={24} height={24} />
            </div>
            <div>
              <AlertDialogTitle className="text-xl font-bold">Habilitar y Registrar Docente</AlertDialogTitle>
              <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Seleccione el usuario registrado para otorgarle el rol de docente y configurar su perfil profesional.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        {loadingOptions ? (
          <div className="py-12 flex justify-center">
            <Spinner className="size-8 text-primary" />
          </div>
        ) : (
          <Form form={form} onSubmit={onSubmit} id="crear-docente" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <SelectField
                name="perfilId"
                label="Usuario registrado"
                required
                placeholder="Seleccione usuario de la academia..."
                options={perfilOpciones}
              />
            </div>

            <TextField
              name="slug"
              label="Slug público (URL)"
              placeholder="Se genera del nombre si lo dejas vacío"
            />
            <TextField
              name="tituloProfesional"
              label="Título profesional"
              placeholder="Ej. Licenciado en Música, Concertista..."
            />

            <SelectField
              name="instrumentoId"
              label="Instrumento principal"
              placeholder="Seleccione instrumento..."
              options={instrumentoOpciones}
            />
            <NumberField name="aniosExperiencia" label="Años de experiencia" asNumber />

            <div className="sm:col-span-2">
              <TextField
                name="fraseDestacada"
                label="Frase destacada"
                placeholder="Ej. 'La disciplina en el piano transforma el alma.'"
              />
            </div>

            <div className="sm:col-span-2">
              <TextareaField
                name="biografia"
                label="Biografía / trayectoria"
                rows={4}
                placeholder="Breve reseña sobre su trayectoria artística y pedagógica..."
              />
            </div>

            <div className="sm:col-span-2 flex flex-wrap items-center gap-6 pt-3 border-t border-border/40">
              <SwitchField name="publicado" label="Publicar en la facultad del sitio web" />
              <SwitchField name="destacado" label="Destacar en la página de inicio" />
            </div>
          </Form>
        )}

        <AlertDialogFooter className="pt-2 gap-3">
          <AlertDialogCancel type="button" disabled={createMutation.isPending} className="h-10 px-5">
            Cancelar
          </AlertDialogCancel>
          <Button
            form="crear-docente"
            type="submit"
            disabled={createMutation.isPending || loadingOptions}
            className="h-10 px-6 font-semibold"
          >
            {createMutation.isPending && <Spinner className="size-4 mr-2" />}
            Guardar Docente
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
