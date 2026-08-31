"use client";

import { Icon } from "@iconify/react";

import {
  AdminDataTable,
  AdminPageHeader,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  type IAdminColumn,
  type IAdminDataTableFilter,
} from "@/shared/ui";
import { formatCurrency, formatDate, formatMonthPeriod } from "@/shared/lib/formatters";

import { useCuotas } from "../hooks/useCuotas";
import { useCondonarCuota } from "../hooks/useCondonarCuota";
import { CUOTA_ESTADO_BADGE, type ICuotaRow } from "../model/cuota.types";
import GenerarCuotasDialog from "./GenerarCuotasDialog";
import RegistrarPagoDialog from "./RegistrarPagoDialog";

export default function CuotasList() {
  const { data, isPending } = useCuotas();
  const condonar = useCondonarCuota();
  const rows = data ?? [];

  const columns: IAdminColumn<ICuotaRow>[] = [
    {
      key: "periodo",
      label: "Período",
      render: (row) => <span className="font-semibold text-primary">{formatMonthPeriod(row.periodo)}</span>,
    },
    {
      key: "estudiante",
      label: "Estudiante",
      render: (row) => <span className="font-medium">{row.estudiante}</span>,
    },
    {
      key: "monto",
      label: "Monto",
      render: (row) => formatCurrency(row.monto),
    },
    {
      key: "pagado",
      label: "Pagado",
      render: (row) => <span className="text-muted-foreground">{formatCurrency(row.montoPagado)}</span>,
    },
    {
      key: "saldo",
      label: "Saldo",
      render: (row) =>
        row.saldo > 0 ? <span className="font-semibold text-destructive">{formatCurrency(row.saldo)}</span> : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      key: "vencimiento",
      label: "Vencimiento",
      render: (row) => (row.fechaVencimiento ? formatDate(row.fechaVencimiento) : <span className="text-muted-foreground">—</span>),
    },
    {
      key: "estado",
      label: "Estado",
      render: (row) => (
        <Badge variant={CUOTA_ESTADO_BADGE[row.estado].variant}>{CUOTA_ESTADO_BADGE[row.estado].label}</Badge>
      ),
    },
  ];

  const filters: IAdminDataTableFilter<ICuotaRow>[] = [
    { value: "pendiente", label: "Pendientes", match: (row) => row.estado === "pendiente" },
    { value: "parcial", label: "Parciales", match: (row) => row.estado === "parcial" },
    { value: "pagada", label: "Pagadas", match: (row) => row.estado === "pagada" },
    { value: "condonada", label: "Condonadas", match: (row) => row.estado === "condonada" },
    { value: "con_saldo", label: "Con saldo", match: (row) => row.saldo > 0 },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Finanzas · GOSMEL"
        title="Cuotas"
        description="Cuotas mensuales generadas a partir de los acuerdos de pago."
        icon="ph:receipt"
      >
        <GenerarCuotasDialog />
      </AdminPageHeader>

      <AdminDataTable
        data={rows}
        columns={columns}
        loading={isPending}
        keyId={(row) => row.id}
        searchKeys={[(row) => row.estudiante, (row) => row.periodo]}
        filters={filters}
        emptyTitle="Sin cuotas"
        emptyDescription="Usa «Generar cuotas» para crearlas a partir de los acuerdos vigentes."
        countLabel="cuotas"
        rowActions={(row) => {
          const conSaldo = row.saldo > 0 && row.estado !== "condonada";

          return (
            <div className="flex items-center justify-end gap-2">
              {conSaldo ? (
                <RegistrarPagoDialog cuota={{ id: row.id, estudiante: row.estudiante, saldo: row.saldo }} />
              ) : null}

              {row.estado === "pendiente" || row.estado === "parcial" ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-xs" aria-label="Acciones de cuota">
                      <Icon icon="ph:dots-three-vertical" className="size-4" aria-hidden="true" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      disabled={condonar.isPending}
                      onSelect={() => condonar.mutate(row.id)}
                    >
                      <Icon icon="ph:hand-heart" className="mr-2 size-4 text-accent" aria-hidden="true" />
                      Condonar cuota
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
            </div>
          );
        }}
      />
    </div>
  );
}