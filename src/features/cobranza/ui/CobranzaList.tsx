"use client";

import { AdminDataTable, AdminPageHeader, Badge, type IAdminColumn, type IAdminDataTableFilter } from "@/shared/ui";
import { formatCurrency, formatMonthPeriod } from "@/shared/lib/formatters";

import { useCobranza } from "../hooks/useCobranza";
import type { ICobranzaRow } from "../model/cobranza.types";

export default function CobranzaList() {
  const { data, isPending } = useCobranza();
  const rows = data ?? [];

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
        title="Cobranza"
        description="Resumen de saldos por representante a partir de los acuerdos de pago."
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
      />
    </div>
  );
}