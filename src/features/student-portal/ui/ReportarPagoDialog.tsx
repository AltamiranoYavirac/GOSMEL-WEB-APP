"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { Button, Spinner, AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/shared/ui";
import { Form, NumberField, SelectField, TextField, useAppForm } from "@/shared/form";

import { useReportStudentPayment } from "../hooks/useReportStudentPayment";
import { formatMonthPeriod } from "@/shared/lib/formatters";
import {
  getReportarPagoFormDefaults,
  METODO_PAGO_OPCIONES,
  reportarPagoFormSchema,
  type IReportarPagoFormValues,
} from "../model/ReportarPagoForm.config";
import type { IReportarPagoDialogProps } from "./ReportarPagoDialog.types";

export default function ReportarPagoDialog({ estudianteId, cuota, contacto, open, onOpenChange }: IReportarPagoDialogProps) {
  const mutation = useReportStudentPayment(estudianteId);
  const [subiendo, setSubiendo] = useState(false);
  const [archivo, setArchivo] = useState<string | null>(null);

  const form = useAppForm<IReportarPagoFormValues>({
    schema: reportarPagoFormSchema,
    values: getReportarPagoFormDefaults(cuota?.saldo ?? 0),
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });

  const handleOpenChange = (next: boolean) => {
    if (next && cuota) {
      form.reset(getReportarPagoFormDefaults(cuota.saldo));
      setArchivo(null);
    }
    onOpenChange(next);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setSubiendo(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload/receipt", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || "Error al subir el comprobante");

      form.setValue("comprobanteStoragePath", json.storage_path || json.url);
      setArchivo(json.filename || file.name);
      toast.success("Comprobante subido correctamente");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo subir el comprobante");
    } finally {
      setSubiendo(false);
      event.target.value = "";
    }
  };

  if (!cuota) return null;

  const onSubmit = (values: IReportarPagoFormValues) => {
    mutation.mutate({ cuotaId: cuota.cuotaId, values }, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <AlertDialogHeader>
          <AlertDialogTitle>Reportar pago</AlertDialogTitle>
          <AlertDialogDescription>Cuota de {formatMonthPeriod(cuota.periodo)} — saldo {cuota.saldo.toFixed(2)}</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="rounded-lg border border-accent-muted/40 bg-background p-3 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">Para transferir o consignar, contáctanos:</p>
          <p>
            {[contacto.telefono, contacto.whatsapp, contacto.emailGeneral].filter(Boolean).join(" · ") || "Oficina de la academia"}
            {contacto.horarioAtencion ? ` · ${contacto.horarioAtencion}` : ""}
          </p>
        </div>

        <Form form={form} onSubmit={onSubmit} id="reportar-pago" className="flex flex-col gap-4">
          <NumberField
            name="monto"
            label="Monto pagado ($)"
            asNumber
            startIcon={<Icon icon="ph:currency-dollar" className="size-4" aria-hidden="true" />}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <SelectField name="metodo" label="Método de pago" options={METODO_PAGO_OPCIONES} />
            <TextField name="referencia" label="Referencia / N° de comprobante (opcional)" />
          </div>

          <div>
            <p className="mb-1 text-sm font-medium text-foreground">Comprobante (opcional)</p>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" disabled={subiendo} onClick={() => document.getElementById("comprobante-input")?.click()}>
                {subiendo ? <Spinner className="size-4" /> : <Icon icon="ph:upload-simple" aria-hidden="true" />}
                {archivo ? "Cambiar comprobante" : "Adjuntar comprobante"}
              </Button>
              {archivo ? <span className="truncate text-xs text-muted-foreground">{archivo}</span> : null}
              <input id="comprobante-input" type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileChange} />
            </div>
          </div>
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button form="reportar-pago" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            Reportar pago
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}