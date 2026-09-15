"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

import {
  AdminDataTable,
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
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
import { Form, TextareaField, useAppForm } from "@/shared/form";
import { formatCurrency, formatDate, formatMonthPeriod } from "@/shared/lib/formatters";

import { useCuotas } from "../hooks/useCuotas";
import { useCondonarCuota } from "../hooks/useCondonarCuota";
import { useReactivarCuota } from "../hooks/useReactivarCuota";
import { useEliminarCuota } from "../hooks/useEliminarCuota";
import { CUOTA_ESTADO_BADGE, type ICuotaRow } from "../model/cuota.types";
import GenerarCuotasDialog from "./GenerarCuotasDialog";
import CrearCuotaDialog from "./CrearCuotaDialog";
import EditarCuotaDialog from "./EditarCuotaDialog";
import RegistrarPagoDialog from "./RegistrarPagoDialog";
import { getMotivoCuotaFormDefaults, motivoCuotaFormSchema, type IMotivoCuotaFormValues } from "../model/MotivoCuotaForm.config";

export default function CuotasList() {
  const { data, isPending } = useCuotas();
  const condonar = useCondonarCuota();
  const reactivar = useReactivarCuota();
  const eliminar = useEliminarCuota();
  const rows = data ?? [];
  const [operacion, setOperacion] = useState<{ cuota: ICuotaRow; tipo: "condonar" | "anular" } | null>(null);
  const motivoForm = useAppForm<IMotivoCuotaFormValues>({ schema: motivoCuotaFormSchema, values: getMotivoCuotaFormDefaults() });
  const confirmarOperacion = (values: IMotivoCuotaFormValues) => {
    if (!operacion) return;
    const mutation = operacion.tipo === "condonar" ? condonar : eliminar;
    mutation.mutate({ cuotaId: operacion.cuota.id, motivo: values.motivo }, { onSuccess: () => setOperacion(null) });
  };

  const columns: IAdminColumn<ICuotaRow>[] = [
    {
      key: "periodo",
      label: "Período",
      cellClassName: "whitespace-nowrap tabular-nums",
      render: (row) => <span className="font-medium text-foreground">{formatMonthPeriod(row.periodo)}</span>,
    },
    {
      key: "estudiante",
      label: "Estudiante",
      cellClassName: "max-w-[220px]",
      render: (row) => <span className="block truncate font-medium">{row.estudiante}</span>,
    },
    {
      key: "monto",
      label: "Monto",
      headerClassName: "text-right",
      cellClassName: "text-right tabular-nums",
      render: (row) => formatCurrency(row.monto),
    },
    {
      key: "pagado",
      label: "Pagado",
      headerClassName: "text-right",
      cellClassName: "text-right text-muted-foreground tabular-nums",
      render: (row) => formatCurrency(row.montoPagado),
    },
    {
      key: "saldo",
      label: "Saldo",
      headerClassName: "text-right",
      cellClassName: "text-right tabular-nums",
      render: (row) =>
        row.saldo > 0 ? <span className="font-medium text-destructive">{formatCurrency(row.saldo)}</span> : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      key: "reservado",
      label: "En verificación",
      headerClassName: "text-right",
      cellClassName: "text-right tabular-nums",
      render: (row) => (row.saldoReservado ?? 0) > 0 ? (
        <span className="font-medium text-amber-700 dark:text-amber-400">{formatCurrency(row.saldoReservado)}</span>
      ) : <span className="text-muted-foreground">—</span>,
    },
    {
      key: "vencimiento",
      label: "Vencimiento",
      cellClassName: "whitespace-nowrap tabular-nums",
      render: (row) => (row.fechaVencimiento ? formatDate(row.fechaVencimiento) : <span className="text-muted-foreground">—</span>),
    },
    {
      key: "estado",
      label: "Estado",
      cellClassName: "whitespace-nowrap",
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
    { value: "anulada", label: "Anuladas", match: (row) => row.estado === "anulada" },
    { value: "con_saldo", label: "Con saldo", match: (row) => row.saldo > 0 },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Finanzas · GOSMEL"
        title="Cuotas"
        description="Cuotas mensuales generadas y extraordinarias a partir de los acuerdos de pago."
        icon="ph:receipt"
      >
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <CrearCuotaDialog />
          <GenerarCuotasDialog />
        </div>
      </AdminPageHeader>

      <AdminDataTable
        data={rows}
        columns={columns}
        loading={isPending}
        keyId={(row) => row.id}
        searchKeys={[(row) => row.estudiante, (row) => row.periodo]}
        searchPlaceholder="Buscar por estudiante o período…"
        filters={filters}
        emptyTitle="Sin cuotas"
        emptyDescription="Usa «Generar cuotas» o «Nueva cuota manual» para crear cuotas."
        countLabel="cuotas"
        mobileCard={{
          titleKey: "estudiante",
          summaryKeys: ["saldo", "estado", "vencimiento"],
          detailsKeys: ["periodo", "monto", "pagado", "reservado"],
        }}
        rowActions={(row) => {
          const conSaldo = row.saldo > 0 && row.estado !== "condonada" && row.estado !== "anulada";
          const puedeReactivar = row.estado === "condonada";
          const puedeCondonar = row.estado === "pendiente" || row.estado === "parcial";
          const puedeAnular = row.montoPagado === 0 && row.estado !== "anulada" && row.estado !== "pagada";
          const tieneAcciones = puedeReactivar || puedeCondonar || puedeAnular;

          return (
            <div className="flex items-center justify-end gap-1">
              {conSaldo ? (
                <RegistrarPagoDialog cuota={row} />
              ) : null}

              <EditarCuotaDialog cuota={row} />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-xs" aria-label="Más acciones" disabled={!tieneAcciones}>
                    <Icon icon="ph:dots-three-vertical" className="size-4" aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                {tieneAcciones ? (
                <DropdownMenuContent align="end">
                  {puedeReactivar ? (
                    <DropdownMenuItem
                      disabled={reactivar.isPending}
                      onSelect={() => reactivar.mutate(row.id)}
                    >
                      <Icon icon="ph:arrow-counter-clockwise" className="mr-2 size-4 text-primary" aria-hidden="true" />
                      Volver a cobrar (Reactivar)
                    </DropdownMenuItem>
                  ) : null}

                  {puedeCondonar ? (
                    <DropdownMenuItem
                      disabled={condonar.isPending}
                      onSelect={() => { motivoForm.reset(getMotivoCuotaFormDefaults()); setOperacion({ cuota: row, tipo: "condonar" }); }}
                    >
                      <Icon icon="ph:hand-heart" className="mr-2 size-4 text-accent" aria-hidden="true" />
                      Condonar cuota
                    </DropdownMenuItem>
                  ) : null}

                  {puedeAnular ? (
                    <DropdownMenuItem
                      variant="destructive"
                      disabled={eliminar.isPending}
                      onSelect={() => { motivoForm.reset(getMotivoCuotaFormDefaults()); setOperacion({ cuota: row, tipo: "anular" }); }}
                    >
                      <Icon icon="ph:trash" className="mr-2 size-4" aria-hidden="true" />
                      Anular cuota
                    </DropdownMenuItem>
                  ) : null}
                </DropdownMenuContent>
                ) : null}
              </DropdownMenu>
            </div>
          );
        }}
      />
      <AlertDialog open={Boolean(operacion)} onOpenChange={(open) => { if (!open) setOperacion(null); }}>
        <AlertDialogContent className="w-full max-w-md p-6"><AlertDialogHeader><AlertDialogTitle>{operacion?.tipo === "condonar" ? "Condonar cuota" : "Anular cuota"}</AlertDialogTitle></AlertDialogHeader><p className="text-sm text-muted-foreground">{operacion?.tipo === "condonar" ? "Se perdona el saldo pendiente y se conserva el historial." : "La cuota no tiene pagos y quedará anulada en el historial."}</p><Form form={motivoForm} onSubmit={confirmarOperacion} id="motivo-cuota"><TextareaField name="motivo" label="Motivo" rows={3} /></Form><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><Button form="motivo-cuota" type="submit" variant={operacion?.tipo === "anular" ? "destructive" : "default"} disabled={condonar.isPending || eliminar.isPending}>Confirmar</Button></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
