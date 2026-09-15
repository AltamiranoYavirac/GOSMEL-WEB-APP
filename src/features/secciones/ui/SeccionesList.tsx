"use client";

import Image from "next/image";

import { AdminDataTable, AdminPageHeader, Badge, Switch, type IAdminColumn, type IAdminDataTableFilter } from "@/shared/ui";
import { formatDateTime } from "@/shared/lib/formatters";
import { buildCloudinaryImageUrl } from "@/shared/lib";

import { useSecciones } from "../hooks/useSecciones";
import { useUpdateSeccionPublicado } from "../hooks/useUpdateSeccionPublicado";
import type { ISeccionRow } from "../model/seccion.types";
import EliminarSeccionDialog from "./EliminarSeccionDialog";
import SeccionFormDialog from "./SeccionFormDialog";

export default function SeccionesList() {
  const { data, isPending } = useSecciones();
  const mutation = useUpdateSeccionPublicado();
  const rows = data ?? [];

  const columns: IAdminColumn<ISeccionRow>[] = [
    {
      key: "imagen",
      label: "Imagen",
      render: (row) => {
        const src = buildCloudinaryImageUrl(row.imagenPublicId, "ar_4:3,c_fill,g_auto,w_160,q_auto,f_auto");
        if (!src) return <span className="text-muted-foreground">—</span>;
        return (
          <span className="relative block h-10 w-14 overflow-hidden rounded-md border border-border">
            <Image src={src} alt={row.imagenTextoAlt ?? row.titulo} fill sizes="56px" className="object-cover" />
          </span>
        );
      },
    },
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
    {
      key: "actions",
      label: "",
      render: (row) => (
        <div className="flex justify-end gap-1">
          <SeccionFormDialog item={row} />
          <EliminarSeccionDialog item={row} />
        </div>
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
      >
        <SeccionFormDialog />
      </AdminPageHeader>

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