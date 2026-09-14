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
  IconPickerField,
  NumberField,
  SelectField,
  SwitchField,
  TextField,
  useAppForm,
} from "@/shared/form";

import { useCrearInstrumento } from "../hooks/useCrearInstrumento";
import { useInstrumentos } from "../hooks/useInstrumentos";
import { useTiposInstrumento } from "../hooks/useTiposInstrumento";
import {
  getInstrumentoFormDefaults,
  instrumentoFormSchema,
  type IInstrumentoFormValues,
} from "../model/InstrumentoForm.config";
import { INSTRUMENT_ICON_OPTIONS } from "../model/instrumento-icons";
import type { ICrearInstrumentoDialogProps } from "./CrearInstrumentoDialog.types";
import CrearTipoInstrumentoDialog from "./CrearTipoInstrumentoDialog";

export default function CrearInstrumentoDialog({ onSuccess }: ICrearInstrumentoDialogProps) {
  const [open, setInternalOpen] = useState(false);
  const [tipoDialogOpen, setTipoDialogOpen] = useState(false);
  const mutation = useCrearInstrumento();
  const tipos = useTiposInstrumento();
  const instrumentos = useInstrumentos();
  const nextOrden = Math.max(0, ...(instrumentos.data ?? []).map((i) => i.orden)) + 1;
  const formValues = useMemo(
    () => getInstrumentoFormDefaults({ orden: nextOrden }),
    [nextOrden],
  );
  const hasTipos = (tipos.data?.length ?? 0) > 0;
  const dialogTitle = tipos.isPending
    ? "Nuevo instrumento"
    : tipos.isError
      ? "No se pudieron cargar las familias"
      : hasTipos
        ? "Nuevo instrumento"
        : "Primero crea una familia";
  const dialogDescription = tipos.isPending
    ? "Agrega un instrumento al catálogo de la academia."
    : tipos.isError
      ? "Revisa la conexión y vuelve a intentar cargar el catálogo."
      : hasTipos
        ? "Agrega un instrumento al catálogo de la academia."
        : "Los instrumentos se organizan por familia. Crea una familia antes de registrar el primer instrumento.";

  const form = useAppForm<IInstrumentoFormValues>({
    schema: instrumentoFormSchema,
    values: formValues,
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });

  const setOpen = (nextOpen: boolean) => {
    if (nextOpen) form.reset(formValues);
    setInternalOpen(nextOpen);
  };

  const onSubmit = (values: IInstrumentoFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        form.reset(formValues);
        setOpen(false);
        onSuccess?.();
      },
    });
  };

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button size="sm">
            <Icon icon="ph:plus" aria-hidden="true" />
            Nuevo instrumento
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8">
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
            <AlertDialogDescription>{dialogDescription}</AlertDialogDescription>
          </AlertDialogHeader>

          {tipos.isPending ? (
            <div className="flex items-center justify-center gap-3 py-10 text-sm text-muted-foreground">
              <Spinner className="size-4" />
              Cargando familias...
            </div>
          ) : tipos.isError ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-5 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <Icon icon="ph:warning-circle" className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
                <p>No fue posible consultar las familias de instrumentos.</p>
              </div>
            </div>
          ) : hasTipos ? (
            <Form form={form} onSubmit={onSubmit} id="crear-instrumento" className="flex flex-col gap-4">
              <TextField name="nombre" label="Nombre del instrumento" placeholder="Ej. Violonchelo" />
              <SelectField
                name="tipoInstrumentoId"
                label="Familia de instrumento"
                placeholder="Seleccionar familia"
                options={(tipos.data ?? []).map((t) => ({ value: t.id, label: t.nombre }))}
              />
              <IconPickerField
                name="icono"
                label="Icono"
                required
                suggestedIcons={INSTRUMENT_ICON_OPTIONS}
              />
              <div className="grid grid-cols-2 items-center gap-3">
                <NumberField name="orden" label="Orden" hint="Se sugiere la siguiente posición disponible." asNumber />
                <div className="pt-5">
                  <SwitchField name="activo" label="Instrumento activo" />
                </div>
              </div>
            </Form>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-5 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <Icon icon="ph:folder-plus" className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                <p>
                  Crea una familia como <span className="font-medium text-foreground">Cuerda</span>,{" "}
                  <span className="font-medium text-foreground">Viento</span> o{" "}
                  <span className="font-medium text-foreground">Tecla</span> para poder seleccionarla aquí.
                </p>
              </div>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            {tipos.isPending ? null : tipos.isError ? (
              <Button type="button" variant="outline" onClick={() => void tipos.refetch()}>
                <Icon icon="ph:arrow-clockwise" aria-hidden="true" />
                Reintentar
              </Button>
            ) : hasTipos ? (
              <Button form="crear-instrumento" type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
                Guardar instrumento
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setTipoDialogOpen(true);
                }}
              >
                <Icon icon="ph:folder-plus" aria-hidden="true" />
                Crear familia
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CrearTipoInstrumentoDialog
        open={tipoDialogOpen}
        onOpenChange={setTipoDialogOpen}
        hideTrigger
        onSuccess={() => setOpen(true)}
      />
    </>
  );
}
