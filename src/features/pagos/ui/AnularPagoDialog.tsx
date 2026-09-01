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
} from "@/shared/ui";
import { formatCurrency } from "@/shared/lib/formatters";

import { useAnularPago } from "../hooks/useAnularPago";
import type { IPagoRow } from "../model/pago.types";

interface IAnularPagoDialogProps {
  pago: IPagoRow;
}

export default function AnularPagoDialog({ pago }: IAnularPagoDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useAnularPago();

  const onConfirm = () => {
    mutation.mutate(pago.id, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon-xs" className="text-destructive hover:bg-destructive/10" aria-label={`Anular pago de ${pago.estudiante}`}>
          <Icon icon="ph:trash" className="size-4" aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-full max-w-md p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            ¿Anular este pago de {formatCurrency(pago.monto)}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Se eliminará el pago de <strong>{pago.estudiante}</strong> ({pago.metodo ?? "Pago"}).
            El saldo de la cuota correspondiente se recalculará y se restaurará de forma automática.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={onConfirm}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Anulando..." : "Anular pago"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
