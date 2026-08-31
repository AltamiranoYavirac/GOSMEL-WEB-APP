"use client";

import { useState } from "react";
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
import { DateField, Form, SelectField, TextField, useAppForm } from "@/shared/form";

import { useEmitirCertificado, useInscripcionesParaCertificados } from "../hooks/useCertificados";
import {
  getCertificadoFormDefaults,
  certificadoFormSchema,
  type ICertificadoFormValues,
} from "../model/CertificadoForm.config";
import type { IEmitirCertificadoDialogProps } from "./EmitirCertificadoDialog.types";

export default function EmitirCertificadoDialog({ onSuccess }: IEmitirCertificadoDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useEmitirCertificado();
  const candidatas = useInscripcionesParaCertificados(open);

  const form = useAppForm<ICertificadoFormValues>({
    schema: certificadoFormSchema,
    defaultValues: getCertificadoFormDefaults(),
  });

  const onSubmit = (values: ICertificadoFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        form.reset(getCertificadoFormDefaults());
        setOpen(false);
        onSuccess?.();
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="sm">
          <Icon icon="ph:certificate" aria-hidden="true" />
          Emitir certificado
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Emitir certificado oficial</AlertDialogTitle>
          <AlertDialogDescription>Genera un certificado con código de validación verificable.</AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id="emitir-certificado" className="flex flex-col gap-4">
          <SelectField
            name="inscripcionId"
            label="Estudiante y curso"
            placeholder="Seleccionar estudiante matriculado"
            options={(candidatas.data ?? []).map((c) => ({ value: c.id, label: c.label }))}
          />
          <TextField name="codigoVerificacion" label="Código de verificación único" placeholder="GOS-XXXXXXXX" />
          <DateField name="fechaEmision" label="Fecha de emisión" />
          <TextField name="storagePath" label="Ruta de archivo en Storage (opcional)" placeholder="certificados/2026/..." />
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button form="emitir-certificado" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            Emitir certificado
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
