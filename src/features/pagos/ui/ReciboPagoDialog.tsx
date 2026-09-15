"use client";

import { useState, type ReactNode } from "react";
import { Icon } from "@iconify/react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Badge,
  Button,
} from "@/shared/ui";
import { formatCurrency, formatDate, formatMonthPeriod } from "@/shared/lib/formatters";

import type { IPagoRow } from "../model/pago.types";

interface IReciboPagoDialogProps {
  pago: IPagoRow;
  trigger?: ReactNode;
}

export default function ReciboPagoDialog({ pago, trigger }: IReciboPagoDialogProps) {
  const [open, setOpen] = useState(false);

  if (!pago.numeroRecibo || pago.estado !== "aprobado") return null;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger ?? (
          <Button size="icon-xs" variant="ghost" aria-label={`Ver recibo ${pago.numeroRecibo}`}>
            <Icon icon="ph:receipt" className="size-4" aria-hidden="true" />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="w-full max-w-lg p-6 sm:p-8">
        <AlertDialogHeader>
          <AlertDialogTitle>Recibo de pago</AlertDialogTitle>
          <AlertDialogDescription>Comprobante interno emitido al aprobar el cobro.</AlertDialogDescription>
        </AlertDialogHeader>

        <section className="rounded-lg border bg-muted/30 p-5 text-sm" aria-label="Contenido del recibo">
          <div className="mb-5 flex items-start justify-between gap-4 border-b pb-4">
            <div>
              <p className="font-semibold tracking-wide">GOSMEL</p>
              <p className="text-xs text-muted-foreground">Recibo interno de cobranza</p>
            </div>
            <Badge variant="success">Aprobado</Badge>
          </div>
          <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-3">
            <dt className="text-muted-foreground">N.º de recibo</dt><dd className="font-mono font-semibold">{pago.numeroRecibo}</dd>
            <dt className="text-muted-foreground">Fecha</dt><dd>{formatDate(pago.fechaPago)}</dd>
            <dt className="text-muted-foreground">Estudiante</dt><dd>{pago.estudiante}</dd>
            <dt className="text-muted-foreground">Período</dt><dd>{pago.periodo ? formatMonthPeriod(pago.periodo) : "Pago general"}</dd>
            <dt className="text-muted-foreground">Método</dt><dd className="capitalize">{pago.metodo ?? "No especificado"}</dd>
            <dt className="text-muted-foreground">Referencia</dt><dd>{pago.referencia ?? "—"}</dd>
            <dt className="border-t pt-3 text-base font-medium">Total recibido</dt><dd className="border-t pt-3 text-base font-semibold text-primary">{formatCurrency(pago.monto)}</dd>
          </dl>
        </section>

        <AlertDialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cerrar</Button>
          <Button onClick={() => window.print()}>
            <Icon icon="ph:printer" className="size-4" aria-hidden="true" />
            Imprimir
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
