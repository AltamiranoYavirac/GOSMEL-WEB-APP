"use client";

import { AdminDataTable, AdminPageHeader, Badge, Switch, type IAdminColumn, type IAdminDataTableFilter } from "@/shared/ui";
import { formatDateTime } from "@/shared/lib/formatters";

import { useSecciones } from "../hooks/useSecciones";
import { useUpdateSeccionPublicado } from "../hooks/useUpdateSeccionPublicado";
import type { ISeccionRow } from "../model/seccion.types";

export default function SeccionesList() {
  const { data, isPending } = useSecciones();
  const mutation = useUpdateSeccionPublicado();
  const rows = data ?? [];

  const columns: IAdminColumn<ISeccionRow>[] = [
    {
      key: "titulo",
      label: "Sección",
      render: (row) => <span className="font-medium">{row.titulo}</span>,
    },
    {
      key: "clave",
      label: "Clave",
      render: (row) => <Badge variant="outline">{row.clave}</Badge>,
    },
    {
      key: "orden",
      label: "Orden",
      render: (row) => <span className="font-mono text-sm text-muted-foreground">{row.orden}</span>,
    },
    {
      key: "actualizado",
      label: "Actualizado",
      render: (row) => <span className="text-muted-foreground">{formatDateTime(row.actualizado)}</span>,
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
          aria-label={`Publicar o despublicar ${row.titulo}`}
        />
      ),
    },
  ];

  const filters: IAdminDataTableFilter<ISeccionRow>[] = [
    { value: "publicados", label: "Publicadas", match: (row) => row.publicado },
    { value: "ocultos", label: "Ocultas", match: (row) => !row.publicado },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Sitio · GOSMEL"
        title="Secciones institucionales"
        description="Bloques de contenido editables del sitio, como la página Nosotros."
        icon="ph:layout"
      />

      <AdminDataTable
        data={rows}
        columns={columns}
        loading={isPending}
        keyId={(row) => row.id}
        searchKeys={[(row) => row.titulo, (row) => row.clave]}
        filters={filters}
        emptyTitle="Sin secciones"
        emptyDescription="Cuando se configuren secciones aparecerán aquí."
        countLabel="secciones"
      />
    </div>
  );
}