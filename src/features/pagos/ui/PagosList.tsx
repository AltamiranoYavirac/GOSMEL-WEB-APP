"use client";

import { Icon } from "@iconify/react";

import {
  AdminDataTable,
  AdminPageHeader,
  Badge,
  Button,
  type IAdminColumn,
  type IAdminDataTableFilter,
} from "@/shared/ui";
import { formatCurrency, formatDate, formatMonthPeriod } from "@/shared/lib/formatters";

import { usePagos } from "../hooks/usePagos";
import type { IPagoRow } from "../model/pago.types";

import AnularPagoDialog from "./AnularPagoDialog";

export default function PagosList() {
  const { data, isPending } = usePagos();
  const rows = data ?? [];

  const columns: IAdminColumn<IPagoRow>[] = [
    {
      key: "fecha",
      label: "Fecha",
      render: (row) => <span className="text-muted-foreground">{formatDate(row.fechaPago)}</span>,
    },
    {
      key: "estudiante",
      label: "Estudiante",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.estudiante}</span>
          {row.observacion ? <span className="text-xs text-muted-foreground">{row.observacion}</span> : null}
        </div>
      ),
    },
    {
      key: "periodo",
      label: "Período",
      render: (row) => (row.periodo ? formatMonthPeriod(row.periodo) : <span className="text-muted-foreground">—</span>),
    },
    {
      key: "monto",
      label: "Monto",
      render: (row) => <span className="font-semibold text-primary">{formatCurrency(row.monto)}</span>,
    },
    {
      key: "metodo",
      label: "Método",
      render: (row) => (row.metodo ? <Badge variant="outline">{row.metodo}</Badge> : <span className="text-muted-foreground">—</span>),
    },
    {
      key: "referencia",
      label: "Referencia",
      render: (row) => (
        <span className="font-mono text-xs text-muted-foreground">
          {row.referencia ?? "—"}
        </span>
      ),
    },
    {
      key: "comprobante",
      label: "Comprobante",
      render: (row) =>
        row.comprobanteStoragePath ? (
          <Button
            size="xs"
            variant="ghost"
            asChild
          >
            <a
              href={row.comprobanteStoragePath.startsWith("http") ? row.comprobanteStoragePath : `/api/storage?path=${encodeURIComponent(row.comprobanteStoragePath)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <Icon icon="ph:file-pdf" className="size-3.5" aria-hidden="true" />
              Ver
            </a>
          </Button>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
  ];

  const filters: IAdminDataTableFilter<IPagoRow>[] = [
    { value: "transferencia", label: "Transferencia", match: (row) => (row.metodo ?? "").toLowerCase().includes("transferencia") },
    { value: "efectivo", label: "Efectivo", match: (row) => (row.metodo ?? "").toLowerCase().includes("efectivo") },
    { value: "tarjeta", label: "Tarjeta", match: (row) => (row.metodo ?? "").toLowerCase().includes("tarjeta") },
    { value: "deposito", label: "Depósito", match: (row) => (row.metodo ?? "").toLowerCase().includes("deposito") || (row.metodo ?? "").toLowerCase().includes("depósito") },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Finanzas · GOSMEL"
        title="Pagos"
        description="Registro de pagos realizados contra cada cuota, con su comprobante."
        icon="ph:credit-card"
      />

      <AdminDataTable
        data={rows}
        columns={columns}
        loading={isPending}
        keyId={(row) => row.id}
        searchKeys={[(row) => row.estudiante, (row) => row.metodo ?? "", (row) => row.referencia ?? "", (row) => row.periodo ?? ""]}
        filters={filters}
        emptyTitle="Sin pagos"
        emptyDescription="Cuando se registren pagos aparecerán aquí."
        countLabel="pagos"
        rowActions={(row) => (
          <div className="flex items-center justify-end">
            <AnularPagoDialog pago={row} />
          </div>
        )}
      />
    </div>
  );
}