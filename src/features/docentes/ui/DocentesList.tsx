"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { AdminDataTable, AdminPageHeader, Avatar, AvatarFallback, Badge, Button, Switch, type IAdminColumn, type IAdminDataTableFilter } from "@/shared/ui";
import { initialsOf } from "@/shared/lib/formatters";

import { useDocentes } from "../hooks/useDocentes";
import { useUpdateDocente } from "../hooks/useUpdateDocente";
import { DOCENTE_DESTACADO_BADGE, type IDocenteRow } from "../model/docente.types";
import CrearDocenteDialog from "./CrearDocenteDialog";
import DocenteDetalleSheet from "./DocenteDetalleSheet";
import EditarDocenteDialog from "./EditarDocenteDialog";
import EliminarDocenteDialog from "./EliminarDocenteDialog";

export default function DocentesList() {
  const { data, isPending } = useDocentes();
  const mutation = useUpdateDocente();
  const rows = data ?? [];

  const [editTarget, setEditTarget] = useState<IDocenteRow | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const columns: IAdminColumn<IDocenteRow>[] = [
    {
      key: "docente",
      label: "Docente",
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar size="sm">
            <AvatarFallback>{initialsOf(row.nombre)}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-medium">{row.nombre}</span>
            {row.email ? <span className="truncate text-xs text-muted-foreground">{row.email}</span> : null}
          </div>
        </div>
      ),
    },
    {
      key: "titulo",
      label: "Título",
      render: (row) => row.titulo ?? <span className="text-muted-foreground">—</span>,
    },
    {
      key: "instrumentos",
      label: "Instrumentos",
      render: (row) =>
        row.instrumentos.length > 0 ? (
          <span className="text-muted-foreground">{row.instrumentos.join(", ")}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      key: "experiencia",
      label: "Experiencia",
      render: (row) =>
        row.aniosExperiencia != null ? `${row.aniosExperiencia} años` : <span className="text-muted-foreground">—</span>,
    },
    {
      key: "destacado",
      label: "Destacado",
      render: (row) => (
        <Switch
          size="sm"
          checked={row.destacado}
          disabled={mutation.isPending}
          onCheckedChange={(value) => mutation.mutate({ id: row.id, patch: { destacado: value } })}
          aria-label={`Marcar como destacado a ${row.nombre}`}
        />
      ),
    },
    {
      key: "publicado",
      label: "Publicado",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Switch
            size="sm"
            checked={row.publicado}
            disabled={mutation.isPending}
            onCheckedChange={(value) => mutation.mutate({ id: row.id, patch: { publicado: value } })}
            aria-label={`Publicar o despublicar a ${row.nombre}`}
          />
          <Badge variant={DOCENTE_DESTACADO_BADGE[String(row.publicado) as "true" | "false"].variant}>
            {row.publicado ? "En línea" : "Oculto"}
          </Badge>
        </div>
      ),
    },
  ];

  const filters: IAdminDataTableFilter<IDocenteRow>[] = [
    { value: "publicados", label: "Publicados", match: (row) => row.publicado },
    { value: "ocultos", label: "Ocultos", match: (row) => !row.publicado },
    { value: "destacados", label: "Destacados", match: (row) => row.destacado },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Comunidad · GOSMEL"
        title="Docentes"
        description="Perfiles de docentes: formación, reconocimientos, portafolio e instrumentos que enseñan."
        icon="ph:chalkboard-teacher"
      >
        <CrearDocenteDialog />
      </AdminPageHeader>

      <AdminDataTable
        data={rows}
        columns={columns}
        loading={isPending}
        keyId={(row) => row.id}
        searchKeys={[(row) => row.nombre, (row) => row.email ?? "", (row) => row.titulo ?? ""]}
        filters={filters}
        emptyTitle="Sin docentes"
        emptyDescription="Cuando se registren docentes aparecerán aquí."
        countLabel="docentes"
        rowActions={(row) => (
          <div className="flex items-center justify-end gap-1">
            <DocenteDetalleSheet docenteId={row.id} docenteNombre={row.nombre} />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditTarget(row);
                setEditOpen(true);
              }}
              title="Editar perfil docente"
              className="size-8 p-0"
            >
              <Icon icon="ph:pencil-simple" width={16} height={16} aria-hidden="true" />
            </Button>
            <EliminarDocenteDialog perfilId={row.id} nombre={row.nombre} />
          </div>
        )}
      />

      <EditarDocenteDialog
        docente={editTarget}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </div>
  );
}