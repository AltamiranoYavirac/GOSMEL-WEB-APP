"use client";

import { Icon } from "@iconify/react";

import {
  AdminDataTable,
  AdminPageHeader,
  Badge,
  Switch,
  type IAdminColumn,
  type IAdminDataTableFilter,
} from "@/shared/ui";

import { useInstrumentos } from "../hooks/useInstrumentos";
import { useUpdateInstrumento } from "../hooks/useCrearInstrumento";
import type { IInstrumentoRow } from "../model/instrumento.types";
import CrearInstrumentoDialog from "./CrearInstrumentoDialog";
import EditarInstrumentoDialog from "./EditarInstrumentoDialog";
import CrearTipoInstrumentoDialog from "./CrearTipoInstrumentoDialog";

export default function InstrumentosList() {
  const { data, isPending } = useInstrumentos();
  const mutation = useUpdateInstrumento();
  const rows = data ?? [];

  const columns: IAdminColumn<IInstrumentoRow>[] = [
    {
      key: "nombre",
      label: "Instrumento",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          {row.icono ? (
            <Icon icon={row.icono} className="size-5 text-primary" aria-hidden="true" />
          ) : (
            <Icon icon="ph:music-notes" className="size-5 text-muted-foreground" aria-hidden="true" />
          )}
          <span className="font-medium">{row.nombre}</span>
        </div>
      ),
    },
    {
      key: "tipo",
      label: "Familia",
      render: (row) => <Badge variant="outline">{row.tipo}</Badge>,
    },
    {
      key: "slug",
      label: "Slug",
      render: (row) => <span className="font-mono text-xs text-muted-foreground">{row.slug}</span>,
    },
    {
      key: "orden",
      label: "Orden",
      render: (row) => <span className="font-mono text-xs">{row.orden}</span>,
    },
    {
      key: "activo",
      label: "Activo",
      render: (row) => (
        <Switch
          size="sm"
          checked={row.activo}
          disabled={mutation.isPending}
          onCheckedChange={(value) =>
            mutation.mutate({
              instrumentoId: row.id,
              values: {
                nombre: row.nombre,
                tipoInstrumentoId: row.tipoInstrumentoId,
                icono: row.icono ?? "",
                orden: row.orden,
                activo: value,
              },
            })
          }
          aria-label={`Activar o desactivar ${row.nombre}`}
        />
      ),
    },
  ];

  const filters: IAdminDataTableFilter<IInstrumentoRow>[] = [
    { value: "activos", label: "Activos", match: (row) => row.activo },
    { value: "inactivos", label: "Inactivos", match: (row) => !row.activo },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <AdminPageHeader
          eyebrow="Catálogos · GOSMEL"
          title="Instrumentos"
          description="Catálogo de instrumentos y familias musicales ofertadas por la academia."
          icon="ph:guitar"
        />
        <div className="flex items-center gap-2">
          <CrearTipoInstrumentoDialog />
          <CrearInstrumentoDialog />
        </div>
      </div>

      <AdminDataTable
        data={rows}
        columns={columns}
        loading={isPending}
        keyId={(row) => row.id}
        searchKeys={[(row) => row.nombre, (row) => row.tipo, (row) => row.slug]}
        filters={filters}
        emptyTitle="Sin instrumentos"
        emptyDescription="Cuando se creen instrumentos aparecerán aquí."
        countLabel="instrumentos"
        rowActions={(row) => (
          <div className="flex items-center justify-end">
            <EditarInstrumentoDialog instrumento={row} />
          </div>
        )}
      />
    </div>
  );
}
