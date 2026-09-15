"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  Spinner,
} from "@/shared/ui";
import { useCuotasPendientesFamilia } from "../hooks/useCuotasPendientesFamilia";
import { useRegistrarPagoFamiliar } from "../hooks/useRegistrarPagoFamiliar";
import type { IPagoFamiliarDialogProps } from "./PagoFamiliarDialog.types";
import SeleccionCuotas from "./SeleccionCuotas";

export default function PagoFamiliarDialog({
  representante,
  open,
  onOpenChange,
  onSuccess,
}: IPagoFamiliarDialogProps) {
  const [metodo, setMetodo] = useState("transferencia");
  const [referencia, setReferencia] = useState("");
  const [observacion, setObservacion] = useState("");

  const { data: cuotas, isPending: loadingCuotas } = useCuotasPendientesFamilia(
    representante?.id ?? "",
    representante?.responsableTipo ?? "representante",
    Boolean(open && representante)
  );

  const registrarMutation = useRegistrarPagoFamiliar();

  if (!representante) return null;

  const handleSubmit = (pagos: Array<{ cuotaId: string; monto: number }>) => {
    registrarMutation.mutate(
      {
        pagos,
        responsableId: representante.id,
        responsableTipo: representante.responsableTipo,
        metodo,
        referencia: referencia || undefined,
        observacion: observacion || undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setReferencia("");
          setObservacion("");
          if (onSuccess) onSuccess();
        },
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-full max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-y-auto p-5 sm:p-7">
        <AlertDialogHeader>
          <div className="flex items-start gap-3">
            <Icon
              icon="ph:credit-card"
              width={22}
              height={22}
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-primary"
            />
            <div>
              <AlertDialogTitle className="text-xl font-semibold tracking-tight">
                Registrar Pago Familiar Consolidado
              </AlertDialogTitle>
              <AlertDialogDescription className="mt-1 text-sm leading-5">
                Responsable: <strong>{representante.representante}</strong> ({representante.celular ?? "Sin teléfono"}). Seleccione y ajuste los montos a cancelar.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        {loadingCuotas ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2">
            <Spinner className="size-8 text-primary" />
            <span className="text-xs text-muted-foreground">Consultando estado de cuenta familiar...</span>
          </div>
        ) : (cuotas ?? []).length === 0 ? (
          <div className="space-y-2 rounded-lg border border-border p-8 text-center">
            <Icon icon="ph:check-circle" width={32} height={32} className="mx-auto text-primary" />
            <p className="text-sm font-semibold text-foreground">Familia al día</p>
            <p className="text-xs text-muted-foreground">Esta familia no tiene cuotas pendientes ni saldos en mora registrados.</p>
          </div>
        ) : (
          <SeleccionCuotas
            key={representante.id}
            cuotas={cuotas ?? []}
            metodo={metodo}
            referencia={referencia}
            observacion={observacion}
            onMetodoChange={setMetodo}
            onReferenciaChange={setReferencia}
            onObservacionChange={setObservacion}
            onSubmit={handleSubmit}
            isSubmitting={registrarMutation.isPending}
          />
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
