"use client";

import { useMemo } from "react";
import { Icon } from "@iconify/react";

import {
  AdminDataTable,
  Badge,
  Switch,
  type IAdminColumn,
  type IAdminDataTableFilter,
} from "@/shared/ui";

import { useInstrumentos } from "../hooks/useInstrumentos";
import { useTiposInstrumento } from "../hooks/useTiposInstrumento";
import { useUpdateTipoInstrumento } from "../hooks/useUpdateTipoInstrumento";
import type { ITipoInstrumentoRow } from "../model/instrumento.types";
import EditarTipoInstrumentoDialog from "./EditarTipoInstrumentoDialog";

export default function TiposInstrumentoTab() {
  const tipos = useTiposInstrumento();
  const instrumentos = useInstrumentos();
  const mutation = useUpdateTipoInstrumento();

  const instrumentosPorTipo = useMemo(() => {
    const counts = new Map<string, number>();
    for (const instrumento of instrumentos.data ?? []) {
      if (!instrumento.tipoInstrumentoId) continue;
      counts.set(instrumento.tipoInstrumentoId, (counts.get(instrumento.tipoInstrumentoId) ?? 0) + 1);
    }
    return counts;
  }, [instrumentos.data]);

  if (tipos.isError || instrumentos.isError) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-5 text-sm text-muted-foreground">
        <div className="flex items-start gap-3">
          <Icon icon="ph:warning-circle" className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
          <p>No fue posible cargar las familias e instrumentos del catálogo.</p>
        </div>
      </div>
    );
  }

  const rows = tipos.data ?? [];

  const columns: IAdminColumn<ITipoInstrumentoRow>[] = [
    {
      key: "nombre",
      label: "Familia",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <Icon icon="ph:folder" className="size-5 text-primary" aria-hidden="true" />
          <span className="font-medium">{row.nombre}</span>
        </div>
      ),
    },
    {
      key: "instrumentos",
      label: "Instrumentos",
      render: (row) => <Badge variant="outline">{instrumentosPorTipo.get(row.id) ?? 0}</Badge>,
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
              tipoId: row.id,
              values: { nombre: row.nombre, orden: row.orden, activo: value },
            })
          }
          aria-label={`Activar o desactivar ${row.nombre}`}
        />
      ),
    },
  ];

  const filters: IAdminDataTableFilter<ITipoInstrumentoRow>[] = [
    { value: "activas", label: "Activas", match: (row) => row.activo },
    { value: "inactivas", label: "Inactivas", match: (row) => !row.activo },
  ];

  return (
    <AdminDataTable
      data={rows}
      columns={columns}
      loading={tipos.isPending || instrumentos.isPending}
      keyId={(row) => row.id}
      searchKeys={[(row) => row.nombre]}
      filters={filters}
      emptyTitle="Sin familias"
      emptyDescription="Crea la primera familia para organizar los instrumentos."
      countLabel="familias"
      rowActions={(row) => (
        <EditarTipoInstrumentoDialog tipo={row} instrumentosAsociados={instrumentosPorTipo.get(row.id) ?? 0} />
      )}
    />
  );
}
