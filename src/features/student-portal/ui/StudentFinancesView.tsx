"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

import {
  AdminDataTable,
  AdminPageHeader,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
  type IAdminColumn,
} from "@/shared/ui";
import { formatCurrency, formatDate, formatMonthPeriod } from "@/shared/lib/formatters";

import { useStudentAccountStatement } from "../hooks/useStudentAccountStatement";
import { useStudentPortal } from "../hooks/useStudentPortal";
import { ESTADO_EFECTIVO_BADGE, type IStudentCuotaEstado, type IStudentPago } from "../model/student-dashboard.types";
import ReportarPagoDialog from "./ReportarPagoDialog";
import StudentNoStudents from "./StudentNoStudents";

function cuotaColumns(): IAdminColumn<IStudentCuotaEstado>[] {
  return [
    {
      key: "periodo",
      label: "Período",
      render: (row) => <span className="font-semibold text-primary">{formatMonthPeriod(row.periodo)}</span>,
    },
    {
      key: "monto",
      label: "Monto",
      render: (row) => formatCurrency(row.monto),
    },
    {
      key: "pagado",
      label: "Pagado",
      render: (row) => formatCurrency(row.montoPagado),
    },
    {
      key: "saldo",
      label: "Saldo",
      render: (row) =>
        row.saldo > 0 ? (
          <span className="font-semibold text-destructive">{formatCurrency(row.saldo)}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      key: "vencimiento",
      label: "Vencimiento",
      render: (row) => (row.fechaVencimiento ? formatDate(row.fechaVencimiento) : <span className="text-muted-foreground">—</span>),
    },
    {
      key: "mora",
      label: "Días de mora",
      render: (row) => (row.estadoEfectivo === "vencida" && row.diasMora > 0 ? <span className="text-destructive">{row.diasMora}</span> : <span className="text-muted-foreground">—</span>),
    },
    {
      key: "estado",
      label: "Estado",
      render: (row) => {
        const badge = ESTADO_EFECTIVO_BADGE[row.estadoEfectivo] ?? { label: row.estadoEfectivo, variant: "outline" as const };
        return <Badge variant={badge.variant}>{badge.label}</Badge>;
      },
    },
  ];
}

function pagoColumns(): IAdminColumn<IStudentPago>[] {
  return [
    {
      key: "periodo",
      label: "Período",
      render: (row) => <span className="font-semibold text-primary">{formatMonthPeriod(row.periodo)}</span>,
    },
    {
      key: "fecha",
      label: "Fecha",
      render: (row) => formatDate(row.fecha),
    },
    {
      key: "monto",
      label: "Monto",
      render: (row) => formatCurrency(row.monto),
    },
    {
      key: "metodo",
      label: "Método",
      render: (row) => <span className="capitalize">{row.metodo.replace(/_/g, " ")}</span>,
    },
    {
      key: "referencia",
      label: "Referencia",
      render: (row) => row.referencia ?? <span className="text-muted-foreground">—</span>,
    },
    {
      key: "comprobante",
      label: "Comprobante",
      render: (row) =>
        row.comprobantePath ? (
          <a
            href={row.comprobantePath.startsWith("http") ? row.comprobantePath : `/api/storage?path=${encodeURIComponent(row.comprobantePath)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <Icon icon="ph:file-arrow-down" className="size-3.5" aria-hidden="true" />
            Ver
          </a>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
  ];
}

export default function StudentFinancesView() {
  const { isLoading, estudianteActivo } = useStudentPortal();
  const { data, isPending } = useStudentAccountStatement(estudianteActivo?.id ?? null);
  const [pagoCuota, setPagoCuota] = useState<IStudentCuotaEstado | null>(null);
  const [pagoOpen, setPagoOpen] = useState(false);

  if (!isLoading && !estudianteActivo) {
    return <StudentNoStudents />;
  }

  if (isLoading || isPending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-72 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  const puedePagar = (cuota: IStudentCuotaEstado) => cuota.saldo > 0 && !["pagada", "condonada"].includes(cuota.estadoEfectivo);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Portal · Estudiante"
        title="Finanzas"
        description="Tu acuerdo, tus cuotas y tus pagos reportados."
        icon="ph:currency-circle-dollar"
      />

      <Card>
        <CardHeader>
          <CardTitle>Acuerdo de pago</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-x-8 gap-y-2">
          <div>
            <p className="text-xs text-muted-foreground">Mensualidad</p>
            <p className="font-heading text-2xl font-semibold text-foreground">
              {data?.acuerdo ? formatCurrency(data.acuerdo.montoMensual) : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Día de cobro</p>
            <p className="font-heading text-2xl font-semibold text-foreground">{data?.acuerdo?.diaCobro ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Estado</p>
            <p className="capitalize text-foreground">{data?.acuerdo?.estado ?? "Sin acuerdo"}</p>
          </div>
        </CardContent>
      </Card>

      <AdminDataTable
        data={data?.cuotas ?? []}
        columns={cuotaColumns()}
        loading={false}
        keyId={(row) => row.cuotaId}
        searchKeys={[(row) => row.periodo]}
        emptyTitle="Sin cuotas"
        emptyDescription="Las cuotas generadas aparecerán aquí."
        countLabel="cuotas"
        rowActions={(row) =>
          puedePagar(row) ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPagoCuota(row);
                setPagoOpen(true);
              }}
            >
              <Icon icon="ph:currency-circle-dollar" aria-hidden="true" />
              Reportar pago
            </Button>
          ) : null
        }
      />

      <div>
        <h3 className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">Historial de pagos</h3>
        <AdminDataTable
          data={data?.pagos ?? []}
          columns={pagoColumns()}
          loading={false}
          keyId={(row) => row.id}
          emptyTitle="Sin pagos"
          emptyDescription="Los pagos que reportes o registres aparecerán aquí."
          countLabel="pagos"
        />
      </div>

      {estudianteActivo ? (
        <ReportarPagoDialog
          estudianteId={estudianteActivo.id}
          cuota={pagoCuota}
          contacto={data?.contacto ?? { telefono: null, whatsapp: null, emailGeneral: null, horarioAtencion: null }}
          open={pagoOpen}
          onOpenChange={setPagoOpen}
        />
      ) : null}
    </div>
  );
}