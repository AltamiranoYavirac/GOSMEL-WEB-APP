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

import { useAprobarPago } from "../hooks/useAprobarPago";
import type { IAprobarPagoDialogProps } from "./AprobarPagoDialog.types";

export default function AprobarPagoDialog({ pago }: IAprobarPagoDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useAprobarPago();

  const onConfirm = () => {
    mutation.mutate(pago.id, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          size="xs"
          className="bg-success text-success-foreground hover:bg-success/90 gap-1"
          aria-label={`Aprobar pago de ${pago.estudiante}`}
        >
          <Icon icon="ph:check-circle" className="size-3.5" aria-hidden="true" />
          Aprobar
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-full max-w-md p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground flex items-center gap-2">
            <Icon icon="ph:check-circle" className="size-5 text-success shrink-0" aria-hidden="true" />
            ¿Aprobar pago de {formatCurrency(pago.monto)}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Se aprobará el comprobante de <strong>{pago.estudiante}</strong> ({pago.metodo ?? "Pago"}).
            El saldo de la cuota correspondiente se actualizará automáticamente.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="bg-success text-success-foreground hover:bg-success/90"
            onClick={onConfirm}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Aprobando..." : "Confirmar aprobación"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
