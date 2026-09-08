import Link from "next/link";
import { Icon } from "@iconify/react";

import { Badge, Button, DataLabel } from "@/shared/ui";
import { formatCurrency, formatDate, formatMonthPeriod } from "@/shared/lib/formatters";

import { CUOTA_ESTADO_BADGE } from "../model/estudiante-detalle.types";
import type { IExpedienteTabProps } from "./EstudianteExpediente.types";

export default function ExpedienteFinancieroTab({ detalle }: IExpedienteTabProps) {
  const pagadas = detalle.cuotas.filter((cuota) => cuota.estado === "pagada");
  const ultimoPago = pagadas[pagadas.length - 1] ?? null;
  const proxima = detalle.cuotas.find((cuota) => cuota.estado === "pendiente" || cuota.estado === "parcial") ?? null;
  const saldoTotal = detalle.cuotas.reduce((sum, cuota) => sum + cuota.saldo, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <DataLabel>Próxima cuota</DataLabel>
          <div className="mt-2 font-heading text-[22px] font-extrabold text-foreground">
            {proxima ? formatCurrency(proxima.monto) : "—"}
          </div>
          <div className="mt-1.5 text-[12px] text-muted-foreground">
            {proxima?.fechaVencimiento ? `Vence ${formatDate(proxima.fechaVencimiento)}` : "Sin cuota pendiente"}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <DataLabel>Último pago</DataLabel>
          <div className="mt-2 font-heading text-[22px] font-extrabold text-foreground">
            {ultimoPago ? formatCurrency(ultimoPago.monto) : "—"}
          </div>
          <div className="mt-1.5 text-[12px] text-muted-foreground">
            {ultimoPago ? formatMonthPeriod(ultimoPago.periodo) : "Aún sin pagos"}
          </div>
        </div>
        <div
          className={`rounded-2xl border bg-card p-5 ${saldoTotal > 0 ? "border-danger-border" : "border-border"}`}
        >
          <DataLabel>Saldo pendiente</DataLabel>
          <div className="mt-2 font-heading text-[22px] font-extrabold text-foreground">
            {formatCurrency(saldoTotal)}
          </div>
          <div className="mt-1.5 text-[12px] text-muted-foreground">
            {detalle.cuotas.length} cuota(s) en total
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[15px] font-bold text-foreground">Cuotas</span>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/admin/cobranza">
              Ver cobranza
              <Icon icon="ph:arrow-right" width={12} height={12} aria-hidden="true" />
            </Link>
          </Button>
        </div>
        {detalle.cuotas.length === 0 ? (
          <p className="text-[13px] text-muted-foreground">Sin cuotas generadas para este estudiante.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {detalle.cuotas.map((cuota) => (
              <li
                key={cuota.id}
                className="flex items-center justify-between rounded-lg bg-foreground/[0.03] px-4 py-3"
              >
                <div>
                  <div className="text-[13px] font-semibold text-foreground">
                    {formatMonthPeriod(cuota.periodo)}
                  </div>
                  <div className="text-[12px] text-muted-foreground">
                    {cuota.fechaVencimiento ? `Vence ${formatDate(cuota.fechaVencimiento)}` : "Sin vencimiento"}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[13px] font-bold text-foreground">
                    {formatCurrency(cuota.monto)}
                  </span>
                  <Badge variant={CUOTA_ESTADO_BADGE[cuota.estado].variant}>
                    {CUOTA_ESTADO_BADGE[cuota.estado].label}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
