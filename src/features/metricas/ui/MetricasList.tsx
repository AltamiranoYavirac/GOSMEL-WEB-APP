"use client";

import { Icon } from "@iconify/react";

import { AdminDataTable, AdminPageHeader, Switch, type IAdminColumn, type IAdminDataTableFilter } from "@/shared/ui";

import { useMetricas } from "../hooks/useMetricas";
import { useUpdateMetricaPublicado } from "../hooks/useUpdateMetricaPublicado";
import type { IMetricaRow } from "../model/metrica.types";

export default function MetricasList() {
  const { data, isPending } = useMetricas();
  const mutation = useUpdateMetricaPublicado();
  const rows = data ?? [];

  const columns: IAdminColumn<IMetricaRow>[] = [
    {
      key: "etiqueta",
      label: "Etiqueta",
      render: (row) => <span className="font-medium">{row.etiqueta}</span>,
    },
    {
      key: "valor",
      label: "Valor",
      render: (row) => (
        <span className="font-heading text-lg font-semibold text-primary">
          {row.valor}
          {row.sufijo ? <span className="text-sm font-normal text-muted-foreground"> {row.sufijo}</span> : null}
        </span>
      ),
    },
    {
      key: "icono",
      label: "Icono",
      render: (row) =>
        row.icono ? (
          <Icon icon={row.icono} className="size-5 text-muted-foreground" aria-hidden="true" />
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      key: "orden",
      label: "Orden",
      render: (row) => <span className="font-mono text-sm text-muted-foreground">{row.orden}</span>,
    },
    {
      key: "publicado",
      label: "Publicado",
      render: (row) => (
        <Switch
          size="sm"
          checked={row.publicado}
          disabled={mutation.isPending}
          onCheckedChange={(value) => mutation.mutate({ id: row.id, publicado: value })}
          aria-label={`Publicar o despublicar la métrica ${row.etiqueta}`}
        />
      ),
    },
  ];

  const filters: IAdminDataTableFilter<IMetricaRow>[] = [
    { value: "publicados", label: "Publicadas", match: (row) => row.publicado },
    { value: "ocultos", label: "Ocultas", match: (row) => !row.publicado },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Sitio · GOSMEL"
        title="Métricas"
        description="Cifras destacadas de la academia que se muestran en la página de inicio."
        icon="ph:chart-line-up"
      />

      <AdminDataTable
        data={rows}
        columns={columns}
        loading={isPending}
        keyId={(row) => row.id}
        searchKeys={[(row) => row.etiqueta, (row) => row.valor]}
        filters={filters}
        emptyTitle="Sin métricas"
        emptyDescription="Cuando se configuren métricas aparecerán aquí."
        countLabel="métricas"
      />
    </div>
  );
}