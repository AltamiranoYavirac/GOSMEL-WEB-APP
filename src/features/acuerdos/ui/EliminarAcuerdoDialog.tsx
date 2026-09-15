"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, Button, Spinner } from "@/shared/ui";
import { Form, TextareaField, useAppForm } from "@/shared/form";
import { formatCurrency, formatMonthPeriod } from "@/shared/lib/formatters";

import type { ICierreResolucion } from "../api/eliminarAcuerdo";
import { useEliminarAcuerdo } from "../hooks/useEliminarAcuerdo";
import { useCuotasParaCierre } from "../hooks/useCuotasParaCierre";
import { cierreAcuerdoFormSchema, getCierreAcuerdoFormDefaults, type ICierreAcuerdoFormValues } from "../model/CierreAcuerdoForm.config";
import type { IEliminarAcuerdoDialogProps } from "./EliminarAcuerdoDialog.types";

export default function EliminarAcuerdoDialog({ acuerdo }: IEliminarAcuerdoDialogProps) {
  const [open, setOpen] = useState(false);
  const [acciones, setAcciones] = useState<Record<string, ICierreResolucion["accion"]>>({});
  const cuotasQuery = useCuotasParaCierre(acuerdo.id, open);
  const mutation = useEliminarAcuerdo();
  const form = useAppForm<ICierreAcuerdoFormValues>({ schema: cierreAcuerdoFormSchema, values: getCierreAcuerdoFormDefaults() });
  const cuotas = cuotasQuery.data ?? [];

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) { form.reset(getCierreAcuerdoFormDefaults()); setAcciones({}); }
  };
  const onSubmit = (values: ICierreAcuerdoFormValues) => {
    mutation.mutate({ acuerdoId: acuerdo.id, motivo: values.motivo, resoluciones: cuotas.map((cuota) => ({ cuotaId: cuota.id, accion: acciones[cuota.id] ?? "mantener" })) }, { onSuccess: () => setOpen(false) });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon-xs" className="text-destructive hover:bg-destructive/10" aria-label={`Finalizar acuerdo de ${acuerdo.estudiante}`}><Icon icon="ph:stop-circle" className="size-4" aria-hidden="true" /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6">
        <AlertDialogHeader><AlertDialogTitle>Finalizar acuerdo de {formatCurrency(acuerdo.montoMensual)}</AlertDialogTitle></AlertDialogHeader>
        <p className="text-sm text-muted-foreground">Decide el destino de cada saldo. Las cuotas parciales no se pueden anular.</p>
        {cuotasQuery.isPending ? <div className="py-8 text-center"><Spinner className="mx-auto size-6" /></div> : cuotasQuery.isError ? <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">No se pudieron cargar las cuotas pendientes.</p> : (
          <div className="space-y-2">{cuotas.map((cuota) => <div key={cuota.id} className="grid grid-cols-[1fr_auto] gap-3 rounded-lg border p-3"><div><p className="font-medium">{formatMonthPeriod(cuota.periodo)} · {formatCurrency(cuota.monto - cuota.montoPagado)} pendiente</p><p className="text-xs text-muted-foreground">{cuota.estado === "parcial" ? "Con pagos aprobados." : "Sin pagos aprobados."}</p></div><select aria-label={`Resolución de ${cuota.periodo}`} className="rounded-md border bg-background px-2 text-sm" value={acciones[cuota.id] ?? "mantener"} onChange={(event) => setAcciones((actual) => ({ ...actual, [cuota.id]: event.target.value as ICierreResolucion["accion"] }))}><option value="mantener">Mantener cobro</option><option value="condonar">Condonar saldo</option>{cuota.montoPagado === 0 ? <option value="anular">Anular cuota</option> : null}</select></div>)}</div>
        )}
        <Form form={form} onSubmit={onSubmit} id={`cerrar-acuerdo-${acuerdo.id}`} className="mt-4"><TextareaField name="motivo" label="Motivo de cierre" rows={3} /></Form>
        <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><Button form={`cerrar-acuerdo-${acuerdo.id}`} type="submit" variant="destructive" disabled={mutation.isPending || cuotasQuery.isPending || cuotasQuery.isError}>{mutation.isPending ? "Finalizando..." : "Finalizar acuerdo"}</Button></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
