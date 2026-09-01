"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import {
  AdminDataTable,
  AdminPageHeader,
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  type IAdminColumn,
} from "@/shared/ui";
import { initialsOf } from "@/shared/lib/formatters";

import { useRepresentantes } from "../hooks/useRepresentantes";
import type { IRepresentanteRow } from "../model/representante.types";
import CrearRepresentanteDialog from "./CrearRepresentanteDialog";
import EditarRepresentanteDialog from "./EditarRepresentanteDialog";
import RepresentanteDetalleSheet from "./RepresentanteDetalleSheet";

export default function RepresentantesList() {
  const { data, isPending } = useRepresentantes();
  const rows = data ?? [];

  const [selectedRepId, setSelectedRepId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<IRepresentanteRow | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const handleOpenDetail = (id: string) => {
    setSelectedRepId(id);
    setSheetOpen(true);
  };

  const handleOpenEdit = (rep: IRepresentanteRow) => {
    setEditTarget(rep);
    setEditOpen(true);
  };

  const columns: IAdminColumn<IRepresentanteRow>[] = [
    {
      key: "representante",
      label: "Representante",
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
      key: "cedula",
      label: "Cédula",
      render: (row) => row.cedula ?? <span className="text-muted-foreground">—</span>,
    },
    {
      key: "celular",
      label: "Teléfono",
      render: (row) => row.celular ?? <span className="text-muted-foreground">—</span>,
    },
    {
      key: "ocupacion",
      label: "Ocupación",
      render: (row) => row.ocupacion ?? <span className="text-muted-foreground">—</span>,
    },
    {
      key: "hijos",
      label: "Hijos vinculados",
      render: (row) => (
        <Badge variant={row.hijos > 0 ? "default" : "outline"}>
          {row.hijos > 0 ? `${row.hijos} ${row.hijos === 1 ? "hijo" : "hijos"}` : "Sin vínculos"}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Comunidad · GOSMEL"
        title="Representantes"
        description="Padres o tutores vinculados a estudiantes y su relación de parentesco."
        icon="ph:identification-badge"
      >
        <CrearRepresentanteDialog />
      </AdminPageHeader>

      <AdminDataTable
        data={rows}
        columns={columns}
        loading={isPending}
        keyId={(row) => row.id}
        searchKeys={[(row) => row.nombre, (row) => row.cedula ?? "", (row) => row.celular ?? "", (row) => row.email ?? ""]}
        emptyTitle="Sin representantes"
        emptyDescription="Cuando se vinculen representantes aparecerán aquí."
        countLabel="representantes"
        rowActions={(row) => (
          <div className="flex items-center justify-end gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleOpenDetail(row.id)}
              title="Ver expediente familiar"
              className="size-8 p-0"
            >
              <Icon icon="ph:eye" width={16} height={16} aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleOpenEdit(row)}
              title="Editar datos"
              className="size-8 p-0"
            >
              <Icon icon="ph:pencil-simple" width={16} height={16} aria-hidden="true" />
            </Button>
          </div>
        )}
      />

      <RepresentanteDetalleSheet
        representanteId={selectedRepId}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onEdit={() => {
          const current = rows.find((r) => r.id === selectedRepId);
          if (current) {
            handleOpenEdit(current);
          }
        }}
      />

      <EditarRepresentanteDialog
        representante={editTarget}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </div>
  );
}