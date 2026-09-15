"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Textarea,
} from "@/shared/ui";
import { formatCurrency } from "@/shared/lib/formatters";

import { useAnularPago } from "../hooks/useAnularPago";
import type { IAnularPagoDialogProps } from "./AnularPagoDialog.types";

export default function AnularPagoDialog({ pago, trigger }: IAnularPagoDialogProps) {
  const [open, setOpen] = useState(false);
  const [motivo, setMotivo] = useState("");
  const mutation = useAnularPago();

  const onConfirm = () => {
    if (!motivo.trim()) return;
    mutation.mutate({ pagoId: pago.id, motivo: motivo.trim() }, {
      onSuccess: () => { setOpen(false); setMotivo(""); },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger ?? (
          <Button variant="ghost" size="icon-xs" className="text-destructive hover:bg-destructive/10" aria-label={`Anular pago de ${pago.estudiante}`}>
            <Icon icon="ph:trash" className="size-4" aria-hidden="true" />
          </Button>
        )}
      </AlertDialogTrigger>

      <AlertDialogContent className="w-full max-w-md p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            ¿Anular este pago de {formatCurrency(pago.monto)}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            El cobro de <strong>{pago.estudiante}</strong> ({pago.metodo ?? "Pago"}) se conservará como anulado.
            El saldo se recalculará automáticamente. Indica el motivo para la auditoría.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Textarea value={motivo} onChange={(event) => setMotivo(event.target.value)} placeholder="Motivo de anulación (obligatorio)" aria-label="Motivo de anulación" />

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={onConfirm}
            disabled={mutation.isPending || !motivo.trim()}
          >
            {mutation.isPending ? "Anulando..." : "Anular pago"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
