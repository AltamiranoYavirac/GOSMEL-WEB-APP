"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import {
  AdminDataTable,
  AdminPageHeader,
  Badge,
  Button,
  type IAdminColumn,
  type IAdminDataTableFilter,
} from "@/shared/ui";
import { formatCurrency, formatMonthPeriod } from "@/shared/lib/formatters";

import { useCobranza } from "../hooks/useCobranza";
import type { ICobranzaRow } from "../model/cobranza.types";
import PagoFamiliarDialog from "./PagoFamiliarDialog";

export default function CobranzaList() {
  const { data, isPending } = useCobranza();
  const rows = data ?? [];

  const [pagoTarget, setPagoTarget] = useState<ICobranzaRow | null>(null);
  const [pagoOpen, setPagoOpen] = useState(false);

  const handleOpenPago = (row: ICobranzaRow) => {
    setPagoTarget(row);
    setPagoOpen(true);
  };

  const getWhatsAppUrl = (row: ICobranzaRow) => {
    if (!row.celular) return null;
    const clean = row.celular.replace(/\D/g, "");
    const num = clean.startsWith("0") ? `593${clean.slice(1)}` : clean;
    const msg = `Estimada/o ${row.representante}, le saludamos de GOSMEL Music Academy. Le recordamos el saldo pendiente de ${formatCurrency(
      row.saldoTotal
    )} correspondiente a la mensualidad de sus representados.`;
    return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
  };

  const columns: IAdminColumn<ICobranzaRow>[] = [
    {
      key: "representante",
      label: "Representante",
      render: (row) => <span className="font-medium">{row.representante}</span>,
    },
    {
      key: "celular",
      label: "Celular",
      render: (row) => row.celular ?? <span className="text-muted-foreground">—</span>,
    },
    {
      key: "hijos",
      label: "Hijos con cuota",
      render: (row) => (
        <Badge variant={row.hijosConCuota > 0 ? "outline" : "ghost"}>
          {row.hijosConCuota > 0 ? row.hijosConCuota : "—"}
        </Badge>
      ),
    },
    {
      key: "saldo",
      label: "Saldo total",
      render: (row) =>
        row.saldoTotal > 0 ? (
          <span className="font-semibold text-destructive">{formatCurrency(row.saldoTotal)}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      key: "mes",
      label: "Total del mes",
      render: (row) => (row.totalMes > 0 ? formatCurrency(row.totalMes) : <span className="text-muted-foreground">—</span>),
    },
    {
      key: "mora",
      label: "Días de mora máx.",
      render: (row) =>
        row.diasMoraMax != null ? (
          <Badge variant={row.diasMoraMax > 0 ? "destructive" : "ghost"}>{row.diasMoraMax} días</Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      key: "periodo",
      label: "Período",
      render: (row) => <span className="text-muted-foreground">{formatMonthPeriod(row.periodoMes)}</span>,
    },
  ];

  const filters: IAdminDataTableFilter<ICobranzaRow>[] = [
    { value: "con_saldo", label: "Con saldo", match: (row) => row.saldoTotal > 0 },
    { value: "en_mora", label: "En mora", match: (row) => (row.diasMoraMax ?? 0) > 0 },
    { value: "al_dia", label: "Al día", match: (row) => row.saldoTotal === 0 },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Finanzas · GOSMEL"
        title="Cobranza Familiar"
        description="Resumen consolidado de saldos por representante para gestión de cobro multicuota y avisos."
        icon="ph:coins"
      />

      <AdminDataTable
        data={rows}
        columns={columns}
        loading={isPending}
        keyId={(row) => row.id}
        searchKeys={[(row) => row.representante, (row) => row.celular ?? ""]}
        filters={filters}
        emptyTitle="Sin cobranza"
        emptyDescription="Cuando existan representantes con cuotas aparecerán aquí."
        countLabel="representantes"
        rowActions={(row) => {
          const waUrl = getWhatsAppUrl(row);
          return (
            <div className="flex items-center justify-end gap-1.5">
              {waUrl && row.saldoTotal > 0 && (
                <Button asChild variant="ghost" size="sm" className="size-8 p-0 text-emerald-600 dark:text-emerald-400">
                  <a href={waUrl} target="_blank" rel="noopener noreferrer" title="Enviar recordatorio por WhatsApp">
                    <Icon icon="ph:whatsapp-logo" width={16} height={16} aria-hidden="true" />
                  </a>
                </Button>
              )}
              {row.saldoTotal > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 h-7 text-xs"
                  onClick={() => handleOpenPago(row)}
                >
                  <Icon icon="ph:credit-card" width={14} height={14} aria-hidden="true" />
                  Cobrar
                </Button>
              )}
            </div>
          );
        }}
      />

      <PagoFamiliarDialog
        representante={pagoTarget}
        open={pagoOpen}
        onOpenChange={setPagoOpen}
      />
    </div>
  );
}