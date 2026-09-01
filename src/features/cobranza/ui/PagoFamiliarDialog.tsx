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
  Button,
  Checkbox,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
} from "@/shared/ui";
import { formatCurrency } from "@/shared/lib/formatters";
import type { ICuotaPendienteItem } from "../api/getCuotasPendientesFamilia";
import { useCuotasPendientesFamilia } from "../hooks/useCuotasPendientesFamilia";
import { useRegistrarPagoFamiliar } from "../hooks/useRegistrarPagoFamiliar";
import type { IPagoFamiliarDialogProps } from "./PagoFamiliarDialog.types";

interface ISeleccionCuotasProps {
  cuotas: ICuotaPendienteItem[];
  metodo: string;
  referencia: string;
  observacion: string;
  onMetodoChange: (value: string) => void;
  onReferenciaChange: (value: string) => void;
  onObservacionChange: (value: string) => void;
  onSubmit: (pagos: Array<{ cuotaId: string; monto: number }>) => void;
  isSubmitting: boolean;
}

function SeleccionCuotas({
  cuotas,
  metodo,
  referencia,
  observacion,
  onMetodoChange,
  onReferenciaChange,
  onObservacionChange,
  onSubmit,
  isSubmitting,
}: ISeleccionCuotasProps) {
  const [selectedCuotas, setSelectedCuotas] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    for (const c of cuotas) {
      initial[c.cuotaId] = c.saldo;
    }
    return initial;
  });

  const totalPagar = Object.values(selectedCuotas).reduce((acc, curr) => acc + (Number(curr) || 0), 0);

  const handleToggleCuota = (cuotaId: string, saldo: number) => {
    setSelectedCuotas((prev) => {
      const copy = { ...prev };
      if (copy[cuotaId] !== undefined) {
        delete copy[cuotaId];
      } else {
        copy[cuotaId] = saldo;
      }
      return copy;
    });
  };

  const handleMontoChange = (cuotaId: string, value: string, maxSaldo: number) => {
    const parsed = parseFloat(value);
    const valid = isNaN(parsed) ? 0 : Math.min(Math.max(parsed, 0), maxSaldo);
    setSelectedCuotas((prev) => ({
      ...prev,
      [cuotaId]: valid,
    }));
  };

  const pagosToSubmit = Object.entries(selectedCuotas)
    .filter((entry) => entry[1] > 0)
    .map(([cuotaId, monto]) => ({ cuotaId, monto }));

  const handleSubmit = () => {
    if (pagosToSubmit.length === 0) return;
    onSubmit(pagosToSubmit);
  };

  return (
    <div className="space-y-5 py-1">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Cuotas Pendientes de los Estudiantes ({cuotas.length})
          </Label>
          <span className="text-xs text-muted-foreground">Seleccione las cuotas a incluir</span>
        </div>

        <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
          {cuotas.map((c) => {
            const isSelected = selectedCuotas[c.cuotaId] !== undefined;
            return (
              <div
                key={c.cuotaId}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl border transition-all gap-3 ${
                  isSelected
                    ? "border-primary/50 bg-primary/5 shadow-xs"
                    : "border-border/60 bg-background/40 opacity-70"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Checkbox
                    id={`cuota-${c.cuotaId}`}
                    checked={isSelected}
                    onCheckedChange={() => handleToggleCuota(c.cuotaId, c.saldo)}
                  />
                  <div className="min-w-0 space-y-0.5">
                    <label
                      htmlFor={`cuota-${c.cuotaId}`}
                      className="text-sm font-bold text-foreground truncate block cursor-pointer"
                    >
                      {c.estudianteNombre}
                    </label>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Período: <strong>{c.periodoMes}</strong></span>
                      <span>·</span>
                      <span>Saldo adeudado: <strong className="text-foreground">{formatCurrency(c.saldo)}</strong></span>
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 pt-1 sm:pt-0">
                    <span className="text-xs font-medium text-muted-foreground">Pagar:</span>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                      <Input
                        type="number"
                        step="0.01"
                        min={0.01}
                        max={c.saldo}
                        value={selectedCuotas[c.cuotaId] || ""}
                        onChange={(e) => handleMontoChange(c.cuotaId, e.target.value, c.saldo)}
                        className="w-24 h-9 pl-6 pr-2 text-xs text-right font-semibold"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-4 sm:p-5 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-between shadow-xs">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider block">
            Monto Total Consolidado
          </span>
          <span className="text-[11px] text-muted-foreground">
            Suma total a registrar en este comprobante
          </span>
        </div>
        <span className="text-2xl font-extrabold text-primary">
          {formatCurrency(totalPagar)}
        </span>
      </div>

      <div className="p-4 sm:p-5 rounded-2xl bg-muted/30 border border-border/60 space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
          Detalles del Comprobante
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fam-metodo">Método de Pago *</Label>
            <Select value={metodo} onValueChange={onMetodoChange}>
              <SelectTrigger id="fam-metodo" className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Transferencia bancaria">Transferencia bancaria</SelectItem>
                <SelectItem value="Efectivo en caja">Efectivo en caja</SelectItem>
                <SelectItem value="Depósito bancario">Depósito bancario</SelectItem>
                <SelectItem value="Tarjeta / Datáfono">Tarjeta de débito/crédito</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fam-ref">Nº de Referencia / Comprobante</Label>
            <Input
              id="fam-ref"
              value={referencia}
              onChange={(e) => onReferenciaChange(e.target.value)}
              placeholder="Ej. TRANS-982341"
              className="h-10"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="fam-obs">Observación / Nota Contable</Label>
            <Input
              id="fam-obs"
              value={observacion}
              onChange={(e) => onObservacionChange(e.target.value)}
              placeholder="Ej. Pago conjunto de mensualidad de septiembre..."
              className="h-10"
            />
          </div>
        </div>
      </div>

      <AlertDialogFooter className="pt-2 gap-3">
        <AlertDialogCancel type="button" disabled={isSubmitting} className="h-10 px-5">
          Cancelar
        </AlertDialogCancel>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || pagosToSubmit.length === 0}
          className="h-10 px-6 font-semibold"
        >
          {isSubmitting && <Spinner className="size-4 mr-2" />}
          Confirmar Pago de {formatCurrency(totalPagar)}
        </Button>
      </AlertDialogFooter>
    </div>
  );
}

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
            <Icon icon="ph:check-circle" width={32} height={32} className="mx-auto text-emerald-500" />
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