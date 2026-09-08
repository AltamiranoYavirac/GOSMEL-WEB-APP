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
  const [metodo, setMetodo] = useState("Transferencia bancaria");
  const [referencia, setReferencia] = useState("");
  const [observacion, setObservacion] = useState("");

  const { data: cuotas, isPending: loadingCuotas } = useCuotasPendientesFamilia(
    representante?.id ?? "",
    Boolean(open && representante)
  );

  const registrarMutation = useRegistrarPagoFamiliar();

  if (!representante) return null;

  const handleSubmit = (pagos: Array<{ cuotaId: string; monto: number }>) => {
    registrarMutation.mutate(
      {
        pagos,
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
      <AlertDialogContent className="w-full max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 text-primary">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Icon icon="ph:credit-card" width={24} height={24} />
            </div>
            <div>
              <AlertDialogTitle className="text-xl font-bold">
                Registrar Pago Familiar Consolidado
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Tutor: <strong>{representante.representante}</strong> ({representante.celular ?? "Sin teléfono"}). Seleccione y ajuste los montos a cancelar.
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
          <div className="p-8 rounded-2xl bg-background/50 border border-border/60 text-center space-y-2">
            <Icon icon="ph:check-circle" width={32} height={32} className="mx-auto text-success-fg" />
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