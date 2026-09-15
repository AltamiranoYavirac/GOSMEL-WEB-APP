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
import { formatDateTime } from "@/shared/lib/formatters";

import { useResenas, useUpdateResenaPublicado } from "../hooks/useResenas";
import type { IResenaRow } from "../model/resena.types";
import DetalleResenaDialog from "./DetalleResenaDialog";
import EliminarResenaDialog from "./EliminarResenaDialog";

export default function ResenasList() {
  const { data, isPending } = useResenas();
  const updatePublicado = useUpdateResenaPublicado();
  const rows = data ?? [];

  const columns: IAdminColumn<IResenaRow>[] = [
    {
      key: "curso",
      label: "Curso",
      render: (row) => <span className="font-medium">{row.curso}</span>,
    },
    {
      key: "estudiante",
      label: "Estudiante",
      render: (row) => <span className="text-sm">{row.estudiante}</span>,
    },
    {
      key: "puntuacion",
      label: "Puntuación",
      render: (row) => (
        <div className="flex items-center gap-1">
          <Icon icon="ph:star-fill" className="size-4 text-warning" aria-hidden="true" />
          <span className="font-semibold">{row.puntuacion}</span>
          <span className="text-xs text-muted-foreground">/ 5</span>
        </div>
      ),
    },
    {
      key: "comentario",
      label: "Comentario",
      render: (row) => (
        <p className="line-clamp-2 max-w-xs whitespace-normal text-xs text-muted-foreground" title={row.comentario ?? ""}>
          {row.comentario ?? "—"}
        </p>
      ),
    },
    {
      key: "fecha",
      label: "Fecha",
      render: (row) => <span className="text-xs text-muted-foreground">{formatDateTime(row.createdAt)}</span>,
    },
    {
      key: "publicado",
      label: "Aprobada",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Switch
            size="sm"
            checked={row.publicado}
            disabled={updatePublicado.isPending}
            onCheckedChange={(value) => updatePublicado.mutate({ resenaId: row.id, publicado: value })}
            aria-label="Aprobar o despublicar reseña"
          />
          <Badge variant={row.publicado ? "default" : "secondary"}>
            {row.publicado ? "Visible" : "Pendiente"}
          </Badge>
        </div>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <DetalleResenaDialog item={row} />
          <EliminarResenaDialog item={row} />
        </div>
      ),
    },
  ];

  const cursos = Array.from(new Set(rows.map((row) => row.curso))).sort((a, b) => a.localeCompare(b));

  const filters: IAdminDataTableFilter<IResenaRow>[] = [
    { value: "pendientes", label: "Pendientes", match: (row) => !row.publicado },
    { value: "publicadas", label: "Aprobadas", match: (row) => row.publicado },
    { value: "5_estrellas", label: "5 estrellas", match: (row) => row.puntuacion === 5 },
    { value: "bajas", label: "≤ 3 estrellas", match: (row) => row.puntuacion <= 3 },
    ...cursos.map((curso) => ({
      value: `curso:${curso}`,
      label: curso,
      match: (row: IResenaRow) => row.curso === curso,
    })),
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Reputación · GOSMEL"
        title="Moderación de reseñas"
        description="Audita, aprueba o descarta las calificaciones y comentarios de estudiantes en cursos."
        icon="ph:chat-centered-dots"
      />

      <AdminDataTable
        data={rows}
        columns={columns}
        loading={isPending}
        keyId={(row) => row.id}
        searchKeys={[(row) => row.curso, (row) => row.estudiante, (row) => row.comentario ?? ""]}
        filters={filters}
        emptyTitle="Sin reseñas"
        emptyDescription="Cuando los estudiantes califiquen cursos aparecerán aquí."
        countLabel="reseñas"
      />
    </div>
  );
}
