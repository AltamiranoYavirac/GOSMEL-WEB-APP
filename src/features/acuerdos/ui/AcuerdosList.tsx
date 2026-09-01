"use client";

import { AdminDataTable, AdminPageHeader, Badge, type IAdminColumn, type IAdminDataTableFilter } from "@/shared/ui";
import { formatCurrency, formatDate } from "@/shared/lib/formatters";

import { useAcuerdos } from "../hooks/useAcuerdos";
import { ACUERDO_ESTADO_BADGE, type IAcuerdoRow } from "../model/acuerdo.types";
import CrearAcuerdoDialog from "./CrearAcuerdoDialog";
import EditarAcuerdoDialog from "./EditarAcuerdoDialog";
import EliminarAcuerdoDialog from "./EliminarAcuerdoDialog";

export default function AcuerdosList() {
  const { data, isPending } = useAcuerdos();
  const rows = data ?? [];

  const columns: IAdminColumn<IAcuerdoRow>[] = [
    {
      key: "estudiante",
      label: "Estudiante",
      render: (row) => <span className="font-medium">{row.estudiante}</span>,
    },
    {
      key: "monto",
      label: "Mensualidad",
      render: (row) => (
        <span className="font-semibold text-primary">
          {formatCurrency(row.montoMensual)} {row.moneda !== "USD" ? row.moneda : ""}
        </span>
      ),
    },
    {
      key: "diaCobro",
      label: "Día de cobro",
      render: (row) => (row.diaCobro != null ? `Día ${row.diaCobro}` : <span className="text-muted-foreground">—</span>),
    },
    {
      key: "vigencia",
      label: "Vigencia",
      render: (row) => (
        <span className="text-muted-foreground">
          {formatDate(row.fechaInicio)} → {row.fechaFin ? formatDate(row.fechaFin) : "indefinido"}
        </span>
      ),
    },
    {
      key: "inscripcion",
      label: "Inscripción",
      render: (row) => row.inscripcion ?? <span className="text-muted-foreground">—</span>,
    },
    {
      key: "estado",
      label: "Estado",
      render: (row) => (
        <Badge variant={ACUERDO_ESTADO_BADGE[row.estado].variant}>{ACUERDO_ESTADO_BADGE[row.estado].label}</Badge>
      ),
    },
  ];

  const filters: IAdminDataTableFilter<IAcuerdoRow>[] = [
    { value: "vigente", label: "Vigentes", match: (row) => row.estado === "vigente" },
    { value: "suspendido", label: "Suspendidos", match: (row) => row.estado === "suspendido" },
    { value: "finalizado", label: "Finalizados", match: (row) => row.estado === "finalizado" },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Finanzas · GOSMEL"
        title="Acuerdos de pago"
        description="Planes de mensualidad acordados con cada estudiante y su histórico de ajustes."
        icon="ph:handshake"
      >
        <CrearAcuerdoDialog />
      </AdminPageHeader>

      <AdminDataTable
        data={rows}
        columns={columns}
        loading={isPending}
        keyId={(row) => row.id}
        searchKeys={[(row) => row.estudiante, (row) => row.inscripcion ?? ""]}
        filters={filters}
        emptyTitle="Sin acuerdos de pago"
        emptyDescription="Cuando se acuerden mensualidades aparecerán aquí."
        countLabel="acuerdos"
        rowActions={(row) => (
          <div className="flex items-center justify-end gap-1.5">
            <EditarAcuerdoDialog acuerdo={row} />
            <EliminarAcuerdoDialog acuerdo={row} />
          </div>
        )}
      />
    </div>
  );
}