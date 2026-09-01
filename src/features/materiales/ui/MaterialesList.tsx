"use client";

import { Icon } from "@iconify/react";

import { AdminDataTable, AdminPageHeader, Badge, Button, type IAdminColumn, type IAdminDataTableFilter } from "@/shared/ui";

import { useMateriales } from "../hooks/useMateriales";
import { TIPO_MATERIAL_BADGE, VISIBILIDAD_MATERIAL_BADGE, type IMaterialRow } from "../model/material.types";
import CrearMaterialDialog from "./CrearMaterialDialog";
import EliminarMaterialDialog from "./EliminarMaterialDialog";

const TIPO_ICON: Record<string, string> = {
  pdf: "ph:file-pdf",
  audio: "ph:file-audio",
  video: "ph:file-video",
  partitura: "ph:music-notes",
  enlace: "ph:link",
};

export default function MaterialesList() {
  const { data, isPending } = useMateriales();
  const rows = data ?? [];

  const columns: IAdminColumn<IMaterialRow>[] = [
    {
      key: "titulo",
      label: "Material",
      render: (row) => (
        <span className="inline-flex items-center gap-2 font-medium">
          <Icon icon={TIPO_ICON[row.tipo] ?? "ph:file"} className="size-4 text-muted-foreground" aria-hidden="true" />
          {row.titulo}
        </span>
      ),
    },
    {
      key: "tipo",
      label: "Tipo",
      render: (row) => (
        <Badge variant={TIPO_MATERIAL_BADGE[row.tipo].variant}>{TIPO_MATERIAL_BADGE[row.tipo].label}</Badge>
      ),
    },
    {
      key: "visibilidad",
      label: "Visibilidad",
      render: (row) => (
        <Badge variant={VISIBILIDAD_MATERIAL_BADGE[row.visibilidad].variant}>
          {VISIBILIDAD_MATERIAL_BADGE[row.visibilidad].label}
        </Badge>
      ),
    },
    {
      key: "destino",
      label: "Destino",
      render: (row) => row.destino ?? <span className="text-muted-foreground">—</span>,
    },
    {
      key: "recurso",
      label: "Recurso",
      render: (row) => {
        const url = row.storagePath || row.urlExterna;
        if (!url) return <span className="text-muted-foreground">—</span>;

        return (
          <Button size="xs" variant="outline" asChild>
            <a
              href={url.startsWith("http") ? url : `/api/storage?path=${encodeURIComponent(url)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
            >
              <Icon icon={TIPO_ICON[row.tipo] ?? "ph:file"} className="size-3.5" aria-hidden="true" />
              {row.storagePath ? "Ver / Descargar" : "Abrir enlace"}
            </a>
          </Button>
        );
      },
    },
    {
      key: "subidoPor",
      label: "Subido por",
      render: (row) => row.subidoPor ?? <span className="text-muted-foreground">—</span>,
    },
  ];

  const filters: IAdminDataTableFilter<IMaterialRow>[] = [
    { value: "pdf", label: "PDF", match: (row) => row.tipo === "pdf" },
    { value: "audio", label: "Audio", match: (row) => row.tipo === "audio" },
    { value: "video", label: "Video", match: (row) => row.tipo === "video" },
    { value: "partitura", label: "Partituras", match: (row) => row.tipo === "partitura" },
    { value: "enlace", label: "Enlaces", match: (row) => row.tipo === "enlace" },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Académico · GOSMEL"
        title="Materiales"
        description="Partituras, audios, videos y enlaces compartidos con estudiantes y docentes."
        icon="ph:file-audio"
      >
        <CrearMaterialDialog />
      </AdminPageHeader>

      <AdminDataTable
        data={rows}
        columns={columns}
        loading={isPending}
        keyId={(row) => row.id}
        searchKeys={[(row) => row.titulo, (row) => row.destino ?? "", (row) => row.subidoPor ?? ""]}
        filters={filters}
        emptyTitle="Sin materiales"
        emptyDescription="Cuando se compartan materiales aparecerán aquí."
        countLabel="materiales"
        rowActions={(row) => (
          <div className="flex items-center justify-end">
            <EliminarMaterialDialog material={row} />
          </div>
        )}
      />
    </div>
  );
}