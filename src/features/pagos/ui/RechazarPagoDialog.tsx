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
  Input,
} from "@/shared/ui";
import { formatCurrency } from "@/shared/lib/formatters";

import { useRechazarPago } from "../hooks/useRechazarPago";
import type { IRechazarPagoDialogProps } from "./RechazarPagoDialog.types";

export default function RechazarPagoDialog({ pago }: IRechazarPagoDialogProps) {
  const [open, setOpen] = useState(false);
  const [motivo, setMotivo] = useState("");
  const mutation = useRechazarPago();

  const onConfirm = () => {
    mutation.mutate(
      { pagoId: pago.id, observacion: motivo.trim() || "Comprobante no válido o ilegible" },
      {
        onSuccess: () => {
          setOpen(false);
          setMotivo("");
        },
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="xs"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30 gap-1"
          aria-label={`Rechazar pago de ${pago.estudiante}`}
        >
          <Icon icon="ph:x-circle" className="size-3.5" aria-hidden="true" />
          Rechazar
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-full max-w-md p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive flex items-center gap-2">
            <Icon icon="ph:warning" className="size-5 shrink-0" aria-hidden="true" />
            ¿Rechazar comprobante de pago?
          </AlertDialogTitle>
          <AlertDialogDescription>
            El pago de <strong>{pago.estudiante}</strong> por <strong>{formatCurrency(pago.monto)}</strong> quedará marcado como rechazado y la cuota permanecerá pendiente.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2 py-2">
          <label htmlFor="motivo-rechazo" className="text-xs font-medium text-foreground">
            Motivo del rechazo (visible para el estudiante):
          </label>
          <Input
            id="motivo-rechazo"
            placeholder="Ej. Comprobante no legible, valor no coincide, fecha errónea..."
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className="text-sm"
          />
        </div>

        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel disabled={mutation.isPending}>
            Cancelar
          </AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Rechazando..." : "Confirmar rechazo"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
