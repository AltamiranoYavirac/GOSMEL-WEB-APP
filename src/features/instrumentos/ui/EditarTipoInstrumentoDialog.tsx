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
import { Form, NumberField, SwitchField, TextField, useAppForm } from "@/shared/form";

import { useEliminarTipoInstrumento } from "../hooks/useTiposInstrumento";
import { useUpdateTipoInstrumento } from "../hooks/useUpdateTipoInstrumento";
import {
  mapTipoInstrumentoToFormValues,
  tipoInstrumentoFormSchema,
  type ITipoInstrumentoFormValues,
} from "../model/TipoInstrumentoForm.config";
import type { IEditarTipoInstrumentoDialogProps } from "./EditarTipoInstrumentoDialog.types";

export default function EditarTipoInstrumentoDialog({
  tipo,
  instrumentosAsociados,
}: IEditarTipoInstrumentoDialogProps) {
  const [open, setOpen] = useState(false);
  const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);
  const mutation = useUpdateTipoInstrumento();
  const eliminar = useEliminarTipoInstrumento();
  const formValues = useMemo(() => mapTipoInstrumentoToFormValues(tipo), [tipo]);

  const form = useAppForm<ITipoInstrumentoFormValues>({
    schema: tipoInstrumentoFormSchema,
    values: formValues,
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      form.reset(formValues);
      setConfirmarEliminacion(false);
    }
    setOpen(nextOpen);
  };

  const onSubmit = (values: ITipoInstrumentoFormValues) => {
    mutation.mutate(
      { tipoId: tipo.id, values },
      {
        onSuccess: () => setOpen(false),
      },
    );
  };

  const onEliminar = () => {
    if (instrumentosAsociados > 0) return;
    eliminar.mutate(tipo.id, {
      onSuccess: () => {
        setConfirmarEliminacion(false);
        setOpen(false);
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button size="icon-xs" variant="ghost" aria-label={`Editar ${tipo.nombre}`}>
          <Icon icon="ph:pencil-simple" className="size-4" aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        {confirmarEliminacion ? (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle className={instrumentosAsociados > 0 ? undefined : "text-destructive"}>
                {instrumentosAsociados > 0 ? "No se puede eliminar la familia" : `¿Eliminar «${tipo.nombre}»?`}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {instrumentosAsociados > 0
                  ? `Tiene ${instrumentosAsociados} instrumento${instrumentosAsociados === 1 ? "" : "s"} asociado${instrumentosAsociados === 1 ? "" : "s"}. Reasigna o elimina esos instrumentos primero.`
                  : "Esta acción eliminará la familia del catálogo."}
              </AlertDialogDescription>
            </AlertDialogHeader>

            {instrumentosAsociados > 0 ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <Icon icon="ph:warning-circle" className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
                  <p>La base de datos protege esta relación para evitar dejar instrumentos sin familia.</p>
                </div>
              </div>
            ) : null}

            <AlertDialogFooter>
              <Button type="button" variant="outline" onClick={() => setConfirmarEliminacion(false)}>
                Volver
              </Button>
              {instrumentosAsociados === 0 ? (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={onEliminar}
                  disabled={eliminar.isPending || mutation.isPending}
                >
                  {eliminar.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:trash" aria-hidden="true" />}
                  Confirmar eliminación
                </Button>
              ) : null}
            </AlertDialogFooter>
          </>
        ) : (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Editar familia</AlertDialogTitle>
              <AlertDialogDescription>{tipo.nombre}</AlertDialogDescription>
            </AlertDialogHeader>

            <Form form={form} onSubmit={onSubmit} id={`editar-tipo-instrumento-${tipo.id}`} className="flex flex-col gap-4">
              <TextField name="nombre" label="Nombre de la familia" />
              <NumberField name="orden" label="Orden" asNumber />
              <SwitchField name="activo" label="Familia activa" />
            </Form>

            <AlertDialogFooter className="justify-between sm:justify-between">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => setConfirmarEliminacion(true)}
                disabled={eliminar.isPending || mutation.isPending}
              >
                <Icon icon="ph:trash" aria-hidden="true" />
                Eliminar
              </Button>
              <div className="flex items-center gap-2">
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <Button
                  form={`editar-tipo-instrumento-${tipo.id}`}
                  type="submit"
                  disabled={mutation.isPending || eliminar.isPending}
                >
                  {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
                  Guardar cambios
                </Button>
              </div>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
