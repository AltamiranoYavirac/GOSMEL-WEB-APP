"use client";

import { Icon } from "@iconify/react";

import {
  AdminDataTable,
  AdminPageHeader,
  Badge,
  Button,
  Switch,
  type IAdminColumn,
  type IAdminDataTableFilter,
} from "@/shared/ui";
import { formatDateTime } from "@/shared/lib/formatters";

import { useResenas, useUpdateResenaPublicado, useEliminarResena } from "../hooks/useResenas";
import type { IResenaRow } from "../model/resena.types";

export default function ResenasList() {
  const { data, isPending } = useResenas();
  const updatePublicado = useUpdateResenaPublicado();
  const eliminar = useEliminarResena();
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
          <Icon icon="ph:star-fill" className="size-4 text-amber-500" aria-hidden="true" />
          <span className="font-semibold">{row.puntuacion}</span>
          <span className="text-xs text-muted-foreground">/ 5</span>
        </div>
      ),
    },
    {
      key: "comentario",
      label: "Comentario",
      render: (row) => (
        <p className="max-w-xs truncate text-xs text-muted-foreground" title={row.comentario ?? ""}>
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
  ];

  const filters: IAdminDataTableFilter<IResenaRow>[] = [
    { value: "pendientes", label: "Pendientes", match: (row) => !row.publicado },
    { value: "publicadas", label: "Aprobadas", match: (row) => row.publicado },
    { value: "5_estrellas", label: "5 estrellas", match: (row) => row.puntuacion === 5 },
    { value: "bajas", label: "≤ 3 estrellas", match: (row) => row.puntuacion <= 3 },
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
        rowActions={(row) => (
          <div className="flex items-center justify-end">
            <Button
              size="icon-xs"
              variant="ghost"
              disabled={eliminar.isPending}
              onClick={() => eliminar.mutate(row.id)}
              aria-label="Eliminar reseña"
            >
              <Icon icon="ph:trash" className="size-4 text-muted-foreground hover:text-destructive" aria-hidden="true" />
            </Button>
          </div>
        )}
      />
    </div>
  );
}
