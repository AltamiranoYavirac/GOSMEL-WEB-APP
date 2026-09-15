"use client";

import { Icon } from "@iconify/react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  Button,
  DataLabel,
  Spinner,
} from "@/shared/ui";

import type { IDescartarSolicitudDialogProps } from "./DescartarSolicitudDialog.types";

export default function DescartarSolicitudDialog({
  solicitud,
  busy,
  onConfirm,
  onClose,
}: IDescartarSolicitudDialogProps) {
  const open = solicitud !== null;

  return (
    <AlertDialog open={open} onOpenChange={(next) => (next ? null : onClose())}>
      <AlertDialogContent size="xl" className="w-full p-6 sm:p-7">
        <AlertDialogHeader>
          <AlertDialogMedia className="rounded-xl bg-danger-tint text-danger-fg">
            <Icon icon="ph:trash" aria-hidden="true" />
          </AlertDialogMedia>
          <AlertDialogTitle>Descartar solicitud</AlertDialogTitle>
          <AlertDialogDescription>
            La solicitud pasará a descartada. Podrás reabrirla luego si es necesario.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {solicitud ? (
          <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-card p-3.5 sm:p-4">
            <div className="min-w-0">
              <DataLabel>Solicitud seleccionada</DataLabel>
              <p className="mt-0.5 truncate text-sm font-bold text-foreground">{solicitud.nombre}</p>
              <p className="truncate text-xs text-muted-foreground">{solicitud.email}</p>
            </div>
          </div>
        ) : null}

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button variant="destructive" disabled={busy} onClick={onConfirm}>
            {busy ? <Spinner className="size-4" /> : <Icon icon="ph:trash" aria-hidden="true" />}
            Confirmar descarte
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
