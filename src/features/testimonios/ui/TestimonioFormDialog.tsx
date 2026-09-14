"use client";

import { useState } from "react";
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
  Spinner,
} from "@/shared/ui";

import { useCrearTestimonio } from "../hooks/useCrearTestimonio";
import { useTestimonioOptions } from "../hooks/useTestimonioOptions";
import { useUpdateTestimonio } from "../hooks/useUpdateTestimonio";
import {
  getTestimonioFormDefaults,
  testimonioFormSchema,
  type ITestimonioFormValues,
} from "../model/TestimonioForm.config";
import type { ITestimonioFormDialogProps } from "./TestimonioFormDialog.types";

export default function TestimonioFormDialog({ item }: ITestimonioFormDialogProps) {
  const [open, setOpen] = useState(false);
  const createMutation = useCrearTestimonio();
  const updateMutation = useUpdateTestimonio();
  const options = useTestimonioOptions(open);
  const pending = createMutation.isPending || updateMutation.isPending;
  const form = useAppForm<ITestimonioFormValues>({
    schema: testimonioFormSchema,
    values: getTestimonioFormDefaults(item),
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });

  const onSubmit = (values: ITestimonioFormValues) => {
    const onSuccess = () => setOpen(false);
    if (item) updateMutation.mutate({ id: item.id, values }, { onSuccess });
    else createMutation.mutate(values, { onSuccess });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {item ? (
          <Button variant="ghost" size="icon-xs" aria-label={`Editar testimonio de ${item.autor}`}><Icon icon="ph:pencil-simple" aria-hidden="true" /></Button>
        ) : (
          <Button><Icon icon="ph:plus" aria-hidden="true" />Nuevo testimonio</Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-h-[90vh] w-full max-w-2xl overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>{item ? "Editar testimonio" : "Nuevo testimonio"}</AlertDialogTitle>
          <AlertDialogDescription>Asócialo a un curso para mostrarlo en su detalle o déjalo como testimonio general.</AlertDialogDescription>
        </AlertDialogHeader>
        <Form form={form} onSubmit={onSubmit} id={`testimonio-${item?.id ?? "nuevo"}`} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2"><TextField name="autor" label="Autor" required /><TextField name="rol" label="Rol o descripción" /></div>
          <TextareaField name="cita" label="Testimonio" rows={4} required />
          <div className="grid gap-3 sm:grid-cols-2">
            <SelectField name="cursoId" label="Curso" placeholder="Testimonio general" disabled={options.isPending} options={(options.data ?? []).map((course) => ({ value: course.id, label: course.nombre }))} />
            <NumberField name="puntuacion" label="Puntuación" asNumber />
          </div>
          <div className="grid grid-cols-2 items-center gap-3"><NumberField name="orden" label="Orden" asNumber /><div className="pt-5"><SwitchField name="publicado" label="Publicado" /></div></div>
        </Form>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancelar</AlertDialogCancel>
          <Button form={`testimonio-${item?.id ?? "nuevo"}`} type="submit" disabled={pending}>{pending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}Guardar</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
