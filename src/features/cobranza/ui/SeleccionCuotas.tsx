"use client";

import { useState } from "react";

import {
  AlertDialogCancel,
  AlertDialogFooter,
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

import type { ISeleccionCuotasProps } from "./SeleccionCuotas.types";

export default function SeleccionCuotas({
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
    <div className="space-y-6 py-1">
      <section className="space-y-3" aria-labelledby="cuotas-pendientes-title">
        <div className="flex items-center justify-between">
          <Label id="cuotas-pendientes-title" className="text-sm font-semibold text-foreground">
            Cuotas Pendientes de los Estudiantes ({cuotas.length})
          </Label>
          <span className="text-xs text-muted-foreground">Seleccione las cuotas a incluir</span>
        </div>

        <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
          {cuotas.map((c) => {
            const isSelected = selectedCuotas[c.cuotaId] !== undefined;
            return (
              <div
                key={c.cuotaId}
                className={`flex flex-col justify-between gap-3 rounded-lg border p-3.5 transition-colors sm:flex-row sm:items-center ${
                  isSelected
                    ? "border-primary border-l-[3px]"
                    : "border-border hover:border-foreground/25"
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
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
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
      </section>

      <section aria-label="Monto total consolidado" className="flex items-center justify-between gap-4 border-y border-border py-4">
        <div>
          <span className="block text-sm font-semibold text-foreground">
            Monto Total Consolidado
          </span>
          <span className="text-xs text-muted-foreground">
            Suma total a registrar en este comprobante
          </span>
        </div>
        <span className="shrink-0 font-mono text-2xl font-bold tabular-nums text-primary sm:text-3xl">
          {formatCurrency(totalPagar)}
        </span>
      </section>

      <section className="space-y-4 rounded-lg border border-border p-4 sm:p-5" aria-labelledby="comprobante-title">
        <span id="comprobante-title" className="block text-sm font-semibold text-foreground">
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
                <SelectItem value="transferencia">Transferencia</SelectItem>
                <SelectItem value="efectivo">Efectivo</SelectItem>
                <SelectItem value="deposito">Depósito bancario</SelectItem>
                <SelectItem value="tarjeta">Tarjeta</SelectItem>
                <SelectItem value="punto_de_venta">Punto de venta</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
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
      </section>

      <AlertDialogFooter className="gap-3 pt-4">
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
