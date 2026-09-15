"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

import { Form, IconPickerField, NumberField, SwitchField, TextField, useAppForm } from "@/shared/form";
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

import { useActualizarMetrica } from "../hooks/useActualizarMetrica";
import { useCrearMetrica } from "../hooks/useCrearMetrica";
import {
  getMetricaFormDefaults,
  METRICA_ICON_OPTIONS,
  metricaFormSchema,
  type IMetricaFormValues,
} from "../model/MetricaForm.config";
import type { IMetricaFormDialogProps } from "./MetricaFormDialog.types";

export default function MetricaFormDialog({ item }: IMetricaFormDialogProps) {
  const [open, setOpen] = useState(false);
  const createMutation = useCrearMetrica();
  const updateMutation = useActualizarMetrica();
  const pending = createMutation.isPending || updateMutation.isPending;
  const form = useAppForm<IMetricaFormValues>({
    schema: metricaFormSchema,
    values: getMetricaFormDefaults(item),
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });

  const onSubmit = (values: IMetricaFormValues) => {
    const onSuccess = () => setOpen(false);
    if (item) updateMutation.mutate({ id: item.id, values }, { onSuccess });
    else createMutation.mutate(values, { onSuccess });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {item ? (
          <Button variant="ghost" size="icon-xs" aria-label={`Editar métrica ${item.etiqueta}`}>
            <Icon icon="ph:pencil-simple" aria-hidden="true" />
          </Button>
        ) : (
          <Button>
            <Icon icon="ph:plus" aria-hidden="true" />
            Nueva métrica
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-h-[90vh] w-full max-w-xl overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>{item ? "Editar métrica" : "Nueva métrica"}</AlertDialogTitle>
          <AlertDialogDescription>Cifra destacada que se muestra en la página de inicio.</AlertDialogDescription>
        </AlertDialogHeader>
        <Form form={form} onSubmit={onSubmit} id={`metrica-${item?.id ?? "nueva"}`} className="space-y-4">
          <TextField name="etiqueta" label="Etiqueta" required />
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField name="valor" label="Valor" required />
            <TextField name="sufijo" label="Sufijo" placeholder="%, +, etc." />
          </div>
          <IconPickerField name="icono" label="Icono" suggestedIcons={METRICA_ICON_OPTIONS} />
          <div className="grid grid-cols-2 items-center gap-3">
            <NumberField name="orden" label="Orden" asNumber />
            <div className="pt-5">
              <SwitchField name="publicado" label="Publicado" />
            </div>
          </div>
        </Form>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancelar</AlertDialogCancel>
          <Button form={`metrica-${item?.id ?? "nueva"}`} type="submit" disabled={pending}>
            {pending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            Guardar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
